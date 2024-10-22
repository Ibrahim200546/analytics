<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\Repository;

use Dexodus\UserSessionHistoryBundle\Entity\UserSession;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method UserSession|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserSession|null findOneBy(array $criteria, ?array $orderBy = null)
 * @method UserSession[] findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null)
 * @method UserSession[] findAll()
 */
class UserSessionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserSession::class);
    }

    public function getQueryBuilderByUser(UserInterface $user, int $count, int $offset): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('UserSession');
        $queryBuilder
            ->andWhere('UserSession.user = :user')
            ->setParameter('user', $user)
            ->setMaxResults($count)
            ->setFirstResult($offset);

        return $queryBuilder;
    }
}
