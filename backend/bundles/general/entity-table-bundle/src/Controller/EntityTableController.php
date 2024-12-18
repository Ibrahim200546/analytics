<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Controller;

use Dexodus\EntityTableBundle\Service\EntityTableLoaderInterface;
use Dexodus\EntityTableBundle\Service\EntityTableStructureGeneratorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class EntityTableController
{
    public function __construct(
        private EntityTableStructureGeneratorInterface $entityTableStructureGenerator,
        private EntityTableLoaderInterface             $entityTableLoader,
        private SerializerInterface                    $serializer,
    ) {
    }

    #[Route('/entity-table/structure/{entityTableName}', name: 'entityTable.structure')]
    public function structure(string $entityTableName): Response
    {
        $structure = $this->entityTableStructureGenerator->generate($entityTableName);

        return new Response(
            $this->serializer->serialize($structure, 'json'),
            200,
            ['Content-Type' => 'application/json'],
        );
    }

    #[Route('/entity-table/list')]
    public function getFormNames(): Response
    {
        $entityTables = $this->entityTableLoader->getAll();

        return new JsonResponse(array_keys($entityTables));
    }
}
