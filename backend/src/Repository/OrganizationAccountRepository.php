<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\OrganizationAccount;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method OrganizationAccount|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrganizationAccount|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrganizationAccount[] findAll()
 * @method OrganizationAccount[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrganizationAccountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrganizationAccount::class);
    }
}
