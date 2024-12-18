<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Repository;

use Dexodus\TranslationApiBundle\Entity\TranslationUnit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TranslationUnit find($id, $lockMode = null, $lockVersion = null)
 * @method TranslationUnit findOneBy(array $criteria, ?array $orderBy = null)
 * @method TranslationUnit[] findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null)
 * @method TranslationUnit[] findAll()
 */
class TranslationUnitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TranslationUnit::class);
    }

    /** @return TranslationUnit[] */
    public function findAllByLocale(string $locale): array
    {
        $queryBuilder = $this->createQueryBuilder('TranslationUnit');
        $queryBuilder
            ->leftJoin('TranslationUnit.locale', 'Locale')
            ->andWhere('Locale.locale = :locale')
            ->setParameter('locale', $locale);

        return $queryBuilder->getQuery()->getResult();
    }

    public function findOneByKeyAndLocale(string $key, string $locale): TranslationUnit|null
    {
        $queryBuilder = $this->createQueryBuilder('TranslationUnit');
        $queryBuilder
            ->leftJoin('TranslationUnit.locale', 'Locale')
            ->leftJoin('TranslationUnit.translation', 'Translation')
            ->andWhere('Translation.key = :key')
            ->andWhere('Locale.locale = :locale')
            ->setParameter('key', $key)
            ->setParameter('locale', $locale);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }
}
