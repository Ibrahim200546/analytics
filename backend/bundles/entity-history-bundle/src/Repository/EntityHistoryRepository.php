<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Repository;

use Dexodus\EntityHistoryBundle\Entity\EntityHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method EntityHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method EntityHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method EntityHistory[] findAll()
 * @method EntityHistory[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EntityHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EntityHistory::class);
    }

    /** @return EntityHistory[] */
    public function findAllByEntity(string $entityClass, mixed $entityId): array
    {
        $rsm = new ResultSetMapping();
        $rsm->addEntityResult(EntityHistory::class, 'eh');
        $rsm->addFieldResult('eh', 'id', 'id');
        $rsm->addFieldResult('eh', 'entity_class', 'entityClass');
        $rsm->addFieldResult('eh', 'entity_id', 'entityId');
        $rsm->addFieldResult('eh', 'created_at', 'createdAt');
        $rsm->addMetaResult('eh', 'user_id', 'user_id');

        $sql = <<<'PGSQL'
SELECT eh.*, u.id as user_id FROM entity_history eh
    LEFT JOIN "user" u ON eh.user_id = u.id
         WHERE
             eh.entity_class = :entityClass
           AND
             (eh.entity_id::jsonb = :entityId OR eh.entity_id::jsonb = :entityIdInt)
         ORDER BY eh.created_at DESC
PGSQL;

        $query = $this->_em->createNativeQuery($sql, $rsm);
        $query->setParameter('entityClass', $entityClass);
        $query->setParameter('entityId', json_encode($entityId));
        $query->setParameter('entityIdInt', json_encode(intval($entityId)));

        return $query->getResult();
    }

    /** @return EntityHistory[] */
    public function findAllByEntityClass(string $entityClass): array
    {
        $queryBuilder = $this->createQueryBuilder('EntityHistory');

        $queryBuilder
            ->andWhere('EntityHistory.entityClass = :entityClass')
            ->orderBy('EntityHistory.createdAt', 'ASC')
            ->setParameter('entityClass', $entityClass);

        return $queryBuilder->getQuery()->getResult();
    }
}
