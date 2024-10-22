<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\EventListener;

use DateTimeInterface;
use Dexodus\EntityHistoryBundle\Attribute\HideFromHistory;
use Dexodus\EntityHistoryBundle\Entity\EntityHistory;
use Dexodus\EntityHistoryBundle\Entity\EntityHistoryChange;
use Dexodus\EntityHistoryBundle\Entity\WithHistoryInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use ReflectionProperty;
use Symfony\Bundle\SecurityBundle\Security;

#[AsDoctrineListener(Events::preUpdate)]
class SavingUpdateHistoryEventListener
{
    private array $processingData = [];

    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function preUpdate(PreUpdateEventArgs $eventArgs): void
    {
        $entity = $eventArgs->getObject();
        $entityId = $this->getEntityId($entity);
        $entityClass = $this->getEntityClass($entity);

        if (array_key_exists($entityClass, $this->processingData) && array_key_exists($entityId, $this->processingData[$entityClass])) {
            return;
        }

        if (!$this->isRequiredSaveHistory($entityClass)) {
            return;
        }

        $this->processingData[$entityClass] = [...($this->processingData[$entityClass] ?? []), $entityId => true];
        $this->createHistory($entity, $entityId, $eventArgs);
        $this->entityManager->flush();
        unset($this->processingData[$entityClass][$entityId]);
    }

    private function isRequiredSaveHistory(string $entityClass): bool
    {
        return in_array(WithHistoryInterface::class, class_implements($entityClass));
    }

    private function getEntityId(object $entity): mixed
    {
        $classMetadata = $this->entityManager->getClassMetadata($this->getEntityClass($entity));
        $idValues = $classMetadata->getIdentifierValues($entity);

        return !empty($idValues) ? array_values($idValues)[0] : null;
    }

    private function createHistory(object $entity, mixed $entityId, PreUpdateEventArgs $eventArgs): void
    {
        $entityHistory = new EntityHistory();
        $entityHistory->entityClass = $this->getEntityClass($entity);
        $entityHistory->entityId = $entityId;
        $entityHistory->user = $this->security->getUser();

        foreach ($eventArgs->getEntityChangeSet() as $propertyName => $change) {
            if ($change[0] === $change[1]) {
                continue;
            }

            if ($change[0] instanceof DateTimeInterface && $change[1] instanceof DateTimeInterface && $change[0]->format('Y-m-d H:i:s') === $change[1]->format('Y-m-d H:i:s')) {
                continue;
            }

            $reflectionProperty = new ReflectionProperty($entityHistory->entityClass, $propertyName);

            if (!empty($reflectionProperty->getAttributes(HideFromHistory::class))) {
                continue;
            }

            $entityHistoryChange = new EntityHistoryChange();
            $entityHistoryChange->oldValue = $change[0];
            $entityHistoryChange->newValue = $change[1];
            $entityHistoryChange->propertyName = $propertyName;
            $entityHistoryChange->entityHistory = $entityHistory;
            $entityHistory->changes->add($entityHistoryChange);
            $this->entityManager->persist($entityHistoryChange);
        }

        if ($entityHistory->changes->isEmpty()) {
            return;
        }

        $this->entityManager->persist($entityHistory);
    }

    private function getEntityClass(object $entity): string
    {
        return str_replace('Proxies\__CG__\\', '', $entity::class);
    }
}
