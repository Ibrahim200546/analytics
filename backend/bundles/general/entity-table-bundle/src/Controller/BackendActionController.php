<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Controller;

use Dexodus\EntityTableBundle\Action\BackendAction;
use Dexodus\EntityTableBundle\Service\EntityTableLoaderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

readonly class BackendActionController implements ContainerAwareInterface
{
    private ?ContainerInterface $container;

    public function __construct(
        private EntityTableLoaderInterface $entityTableLoader,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function setContainer(?ContainerInterface $container)
    {
        $this->container = $container;
    }

    #[Route('/entity-table/backend-action/{tableName}/{actionId}/{entityId}')]
    public function run(string $tableName, int $actionId, int $entityId): Response
    {
        $entityTable = $this->entityTableLoader->get($tableName);
        $action = $entityTable->attribute->actions[$actionId];

        if (!$action instanceof BackendAction) {
            throw new Exception('Expected BackendAction');
        }

        $repository = $this->entityManager->getRepository($entityTable->entity);
        $entity = $repository->find($entityId);

        /** @var mixed $service */
        $service = $this->container->get($action->serviceId);
        if (is_null($service)) {
            throw new Exception('Service not founded');
        }

        $result = $service($entity);

        return new JsonResponse($result);
    }
}
