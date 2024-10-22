<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\TrackedCurrency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TrackedCurrency|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrackedCurrency|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrackedCurrency[] findAll()
 * @method TrackedCurrency[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrackedCurrencyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrackedCurrency::class);
    }
}
