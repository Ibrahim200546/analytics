<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Controller;

use Dexodus\EntityFormBundle\Service\EntityFormLoaderInterface;
use Dexodus\EntityFormBundle\Service\EntityFormStructureGeneratorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class EntityFormController
{
    public function __construct(
        private EntityFormStructureGeneratorInterface $entityFormStructureGenerator,
        private EntityFormLoaderInterface $entityFormLoader,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/entity-form/structure/{entityFormName}/{mode}', name: 'entityForm.structure')]
    public function structure(string $entityFormName, string $mode = 'create'): Response
    {
        $structure = $this->entityFormStructureGenerator->generate($entityFormName, $mode);

        return new Response(
            $this->serializer->serialize($structure, 'json'),
            200,
            ['Content-Type' => 'application/json'],
        );
    }

    #[Route('/entity-form/list')]
    public function getFormNames(): Response
    {
        $entityForms = $this->entityFormLoader->getAll();

        return new JsonResponse(array_keys($entityForms));
    }
}
