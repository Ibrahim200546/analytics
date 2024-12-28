<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\FileBundle\Entity\File;
use Dexodus\TelegramParserBundle\Repository\TelegramChannelRepository;
use Dexodus\TelegramParserBundle\State\TelegramChannelProcessor;
use Dexodus\TitleBundle\Attribute\Title;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TelegramChannelRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]], processor: TelegramChannelProcessor::class),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]], processor: TelegramChannelProcessor::class),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
class TelegramChannel
{
    public const ROLE_CREATE = 'TelegramChannel.create';
    public const ROLE_EDIT = 'TelegramChannel.edit';
    public const ROLE_VIEW = 'TelegramChannel.view';
    public const ROLE_LIST = 'TelegramChannel.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\Column]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE, self::ROLE_EDIT])]
    #[Title('ID телеграмм канала(пример: "@telegram")')]
    public string $channelId;

    #[ORM\Column]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_EDIT])]
    #[Title('Имя телеграмм канала')]
    public string $channelName;

    #[ORM\ManyToOne]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public File $image;

    #[Title('Добавлен в систему')]
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public DateTimeImmutable $createdAt;

    #[ORM\Column(options: ['default' => false])]
    public bool $isScheduledForUpdate = false;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
