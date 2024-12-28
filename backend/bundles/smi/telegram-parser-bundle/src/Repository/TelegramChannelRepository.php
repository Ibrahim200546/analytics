<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Repository;

use Dexodus\TelegramParserBundle\Entity\TelegramChannel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TelegramChannel|null find($id, $lockMode = null, $lockVersion = null)
 * @method TelegramChannel|null findOneBy(array $criteria, array $orderBy = null)
 * @method TelegramChannel[] findAll()
 * @method TelegramChannel[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TelegramChannelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TelegramChannel::class);
    }

    /**
     * @return TelegramChannel[]
     */
    public function findNotScheduledForUpdate(): array
    {
        return $this->findBy(['isScheduledForUpdate' => false]);
    }
}
