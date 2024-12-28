<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Repository;

use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ArticleComment|null find($id, $lockMode = null, $lockVersion = null)
 * @method ArticleComment|null findOneBy(array $criteria, array $orderBy = null)
 * @method ArticleComment[] findAll()
 * @method ArticleComment[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleCommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArticleComment::class);
    }
}
