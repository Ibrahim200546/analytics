<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Repository;

use Dexodus\TranslationApiBundle\Entity\Translation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Translation find($id, $lockMode = null, $lockVersion = null)
 * @method Translation findOneBy(array $criteria, ?array $orderBy = null)
 * @method Translation[] findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null)
 * @method Translation[] findAll()
 */
class TranslationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Translation::class);
    }

    public function findOneByKey(string $key): ?Translation
    {
        return $this->findOneBy(['key' => $key]);
    }
}
