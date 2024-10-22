<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Repository;

use Dexodus\EntityHistoryBundle\Entity\EntityHistoryChange;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method EntityHistoryChange|null find($id, $lockMode = null, $lockVersion = null)
 * @method EntityHistoryChange|null findOneBy(array $criteria, array $orderBy = null)
 * @method EntityHistoryChange[] findAll()
 * @method EntityHistoryChange[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EntityHistoryChangeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EntityHistoryChange::class);
    }
}
