<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Repository;

use Dexodus\FileBundle\Entity\FileHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FileHistory>
 *
 * @method FileHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method FileHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method FileHistory[]    findAll()
 * @method FileHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FileHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FileHistory::class);
    }

    public function save(FileHistory $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(FileHistory $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
