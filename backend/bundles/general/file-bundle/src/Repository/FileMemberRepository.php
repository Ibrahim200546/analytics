<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Repository;

use Dexodus\FileBundle\Entity\FileMember;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FileMember>
 *
 * @method FileMember|null find($id, $lockMode = null, $lockVersion = null)
 * @method FileMember|null findOneBy(array $criteria, array $orderBy = null)
 * @method FileMember[]    findAll()
 * @method FileMember[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FileMemberRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FileMember::class);
    }

    public function save(FileMember $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(FileMember $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
