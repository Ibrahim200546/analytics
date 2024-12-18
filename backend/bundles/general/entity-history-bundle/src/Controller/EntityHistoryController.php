<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Controller;

use Dexodus\EntityHistoryBundle\Service\HistoryCollector;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class EntityHistoryController
{
    public function __construct(
        private HistoryCollector $historyCollector,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('entity-history/{entityClass}/{entityId}.{format}')]
    public function getAllHistory(string $entityClass, string $entityId, string $format = 'json'): Response
    {
        $allHistories = $this->historyCollector->getAllHistory($entityClass, $entityId);
        $result = $this->serializer->serialize($allHistories, $format);

        return new Response($result, headers: ['Content-Type' => "application/$format"]);
    }
}
