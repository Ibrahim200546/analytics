<?php

declare(strict_types=1);

namespace Dexodus\SingleUniqueBundle\Service;

use Doctrine\ORM\EntityManagerInterface;

class UniqueChecker
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function isUnique(string $entityClass, string $property, string $value, mixed $id = null): bool
    {

        $repository = $this->entityManager->getRepository($entityClass);
        $queryBuilder = $repository->createQueryBuilder('Entity');
        $queryBuilder
            ->andWhere("Entity.$property = :value")
            ->setParameter('value', $value);

        if (!is_null($id)) {
            $meta = $this->entityManager->getClassMetadata($entityClass);
            $identifier = $meta->getSingleIdentifierFieldName();

            $queryBuilder
                ->andWhere("Entity.$identifier != :$identifier")
                ->setParameter($identifier, $id);
        }

        return is_null($queryBuilder->getQuery()->getOneOrNullResult());
    }
}
