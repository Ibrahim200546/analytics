<?php

declare(strict_types=1);

namespace Dexodus\EntityExportBundle\Service;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Dexodus\EntityExportBundle\Enum\ExportTypeEnum;
use Dexodus\EntityExportBundle\Exception\ExporterNotFoundException;
use Dexodus\EntityExportBundle\Service\Exporter\ExporterInterface;
use Dexodus\EntityExportBundle\Service\Exporter\XlsxExporter;
use Dexodus\EntityFormBundle\Exception\MoreThenOneAttributeException;
use Dexodus\EntityTableBundle\Dto\EntityTableStructure;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class Exporter
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private XlsxExporter $xlsxExporter,
        #[Autowire(service: 'service_container')]
        private ContainerInterface $container,
    ) {
    }

    public function export(EntityTableStructure $entityTableStructure, ?string $entitiesPath = null, ExportTypeEnum $type = ExportTypeEnum::TYPE_XLSX): string
    {
        $reflectionClass = new ReflectionClass($entityTableStructure->entity);
        $attributes = $reflectionClass->getAttributes(ApiResource::class);

        if (count($attributes) > 1) {
            throw new MoreThenOneAttributeException($entityTableStructure->entity, null, ApiResource::class);
        }

        $groups = ['Default', 'EntityExport'];
        $providerClass = null;

        if (count($attributes) === 1) {
            /** @var ApiResource $apiResourceAttribute */
            $apiResourceAttribute = $attributes[0]->newInstance();
            $operations = $apiResourceAttribute->getOperations();

            if (!is_null($operations)) {
                foreach ($operations->getIterator() as $operation) {
                    if (!$operation instanceof GetCollection) {
                        continue;
                    }

                    if (!is_null($entitiesPath)) {
                        if ($operation->getUriTemplate() !== $entitiesPath) {
                            continue;
                        }
                    }

                    $normalizationContext = $operation->getNormalizationContext();
                    $providerClass = $operation->getProvider();

                    if ($normalizationContext === null || !is_array($normalizationContext['groups'])) {
                        continue;
                    }

                    $groups = $normalizationContext['groups'];
                    break;
                }
            }
        }

        $exporter = $this->getExporter($type);

        if (is_null($providerClass)) {
            $entityRepository = $this->entityManager->getRepository($entityTableStructure->entity);
            $doctrineEntities = $entityRepository->findAll();
        } else {
            $provider = $this->container->get($providerClass);
            $doctrineEntities = [];
            $page = 1;

            do {
                /** @var Paginator $paginator */
                $paginator = $provider->provide(new GetCollection(), [], ['filters' => ['page' => $page++]]);
                $partDoctrineEntities = $paginator->getQuery()->getResult();
                $doctrineEntities = [...$doctrineEntities, ...$partDoctrineEntities];
            } while (!empty($partDoctrineEntities));
        }

        $entities = [];

        foreach ($doctrineEntities as $entity) {
            $entities[] = json_decode($this->serializer->serialize($entity, 'json', ['groups' => $groups]), true);
        }

        return $exporter->export($entityTableStructure, $entities);
    }

    public function getExporter(ExportTypeEnum $type): ExporterInterface
    {
        switch ($type) {
            case ExportTypeEnum::TYPE_XLSX:
                return $this->xlsxExporter;
        }

        throw new ExporterNotFoundException();
    }
}
