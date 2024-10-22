<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\Service;

use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository as BaseServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

abstract class ServiceEntityRepository extends BaseServiceEntityRepository
{
    private ?bool $classWithDisable = null;

    public function __construct(
        ManagerRegistry $registry,
        private string $entityClass,
    ) {
        parent::__construct($registry, $entityClass);
    }

    public function find($id, $lockMode = null, $lockVersion = null, bool $includeDisabled = false): null|object
    {
        $entity = parent::find($id, $lockMode, $lockVersion);

        if (!$includeDisabled && $entity instanceof WithDisableInterface) {
            return $entity->isDisabled() ? null : $entity;
        }

        return $entity;
    }

    /** @inheritDoc */
    public function findBy(
        array $criteria,
        ?array $orderBy = null,
        $limit = null,
        $offset = null,
    ) {
        if ($this->isClassWithDisable() && !array_key_exists('disabled', $criteria)) {
            $criteria['disabled'] = false;
        }

        return parent::findBy($criteria, $orderBy, $limit, $offset);
    }

    public function findAll(bool $includeDisabled = false): array
    {
        if ($this->isClassWithDisable() && !$includeDisabled) {
            return parent::findBy(['disabled' => false]);
        }

        return parent::findBy([]);
    }

    public function findOneBy(array $criteria, ?array $orderBy = null): object|null
    {
        if ($this->isClassWithDisable() && !array_key_exists('disabled', $criteria)) {
            $criteria['disabled'] = false;
        }

        return parent::findOneBy($criteria, $orderBy);
    }

    /** @inheritDoc */
    public function createQueryBuilder($alias, $indexBy = null)
    {
        $queryBuilder = parent::createQueryBuilder($alias, $indexBy);

        if ($this->isClassWithDisable()) {
            $queryBuilder->andWhere("$alias.disabled = false");
        }

        return $queryBuilder;
    }

    protected function isClassWithDisable(): bool
    {
        if (is_null($this->classWithDisable)) {
            $this->classWithDisable = in_array(WithDisableInterface::class, class_implements($this->entityClass));
        }

        return $this->classWithDisable;
    }
}
