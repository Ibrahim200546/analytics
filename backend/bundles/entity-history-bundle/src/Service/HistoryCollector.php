<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Service;

use Dexodus\EntityHistoryBundle\Repository\EntityHistoryRepository;
use Dexodus\TitleBundle\Service\TitleExtractor;
use Symfony\Component\Serializer\SerializerInterface;

class HistoryCollector
{
    public function __construct(
        private EntityHistoryRepository $entityHistoryRepository,
        private TitleExtractor $titleExtractor,
        private SerializerInterface $serializer,
    ) {
    }

    public function getAllHistory(string $entityClass, string $entityId): array
    {
        $histories = $this->entityHistoryRepository->findAllByEntity($entityClass, $entityId);
        $processedHistories = [];

        foreach ($histories as $entityHistory) {
            $processedChanges = [];

            foreach ($entityHistory->changes as $change) {
                $processedChanges[] = [
                    'propertyName' => $change->propertyName,
                    'oldValue' => $change->oldValue,
                    'newValue' => $change->newValue,
                    'propertyTitle' => $this->titleExtractor->extractTitleFromProperty($entityClass, $change->propertyName) ?? $change->propertyName,
                ];
            }

            $user = json_decode($this->serializer->serialize($entityHistory->user, 'json'), true);

            $processedHistories[] = [
                'changes' => $processedChanges,
                'createdAt' => $entityHistory->createdAt,
                'user' => [
                    'id' => $user['id'] ?? null,
                    'firstName' => $user['firstName'] ?? null,
                    'lastName' => $user['lastName'] ?? null,
                    'email' => $user['email'] ?? null,
                ],
            ];
        }

        return $processedHistories;
    }
}
