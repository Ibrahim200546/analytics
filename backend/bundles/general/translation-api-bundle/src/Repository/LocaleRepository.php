<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Repository;

use Dexodus\TranslationApiBundle\Entity\Locale;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Locale find($id, $lockMode = null, $lockVersion = null)
 * @method Locale findOneBy(array $criteria, ?array $orderBy = null)
 * @method Locale[] findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null)
 * @method Locale[] findAll()
 */
class LocaleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Locale::class);
    }

    public function findOneByLocale(string $locale): ?Locale
    {
        return $this->findOneBy(['locale' => $locale]);
    }
}
