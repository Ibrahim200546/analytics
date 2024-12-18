<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Repository;

use Dexodus\WebResourceBundle\Entity\WebResource;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method WebResource|null find($id, $lockMode = null, $lockVersion = null)
 * @method WebResource|null findOneBy(array $criteria, array $orderBy = null)
 * @method WebResource[] findAll()
 * @method WebResource[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WebResourceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WebResource::class);
    }
}
