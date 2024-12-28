<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Repository;

use Dexodus\TelegramParserBundle\Entity\TelegramAccount;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TelegramAccount|null find($id, $lockMode = null, $lockVersion = null)
 * @method TelegramAccount|null findOneBy(array $criteria, array $orderBy = null)
 * @method TelegramAccount[] findAll()
 * @method TelegramAccount[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TelegramAccountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TelegramAccount::class);
    }

    public function findOneWithMinimumParserLoad(): ?TelegramAccount
    {
        $telegramAccounts = $this->findBy(['usingForParsing' => true], ['parserLoad' => 'asc']);

        return empty($telegramAccounts) ? null : $telegramAccounts[0];
    }
}
