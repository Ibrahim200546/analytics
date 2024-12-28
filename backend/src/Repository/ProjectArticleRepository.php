<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\ProjectArticle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProjectArticle|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectArticle|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectArticle[] findAll()
 * @method ProjectArticle[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectArticle::class);
    }
}
