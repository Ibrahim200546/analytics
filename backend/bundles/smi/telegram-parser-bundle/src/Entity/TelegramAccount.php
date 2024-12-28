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
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\BackendAction;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\SingleUniqueBundle\Attribute\SingleUnique;
use Dexodus\TelegramParserBundle\BackendAction\DisableForParsingAction;
use Dexodus\TelegramParserBundle\BackendAction\EnableForParsingAction;
use Dexodus\TelegramParserBundle\Repository\TelegramAccountRepository;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TelegramAccountRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
])]
#[EntityTable(actions: [
    new BackendAction('Использовать для парсинга', EnableForParsingAction::class, 'entity.usingForParsing == "Нет"', ActionStyleEnum::Violet),
    new BackendAction('Убрать из парсинга', DisableForParsingAction::class, 'entity.usingForParsing == "Да"', ActionStyleEnum::Violet),
])]
#[AsTSType(name: 'TelegramAccount_Create', groups: [self::ROLE_CREATE])]
class TelegramAccount
{
    public const ROLE_CREATE = 'TelegramAccount.create';
    public const ROLE_VIEW = 'TelegramAccount.view';
    public const ROLE_LIST = 'TelegramAccount.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[Title('Имя телеграмм аккаунта')]
    #[ORM\Column]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE])]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[SingleUnique(message: 'Такое имя аккаунта уже используется')]
    public string $name;

    #[Title('API ID<?Для получения, необходимо перейти на https://my.telegram.org и добавить новый App?>')]
    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE])]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    public int $apiId;

    #[Title('API Hash<?Для получения, необходимо перейти на https://my.telegram.org и добавить новый App?>')]
    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE])]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    public string $apiHash;

    #[Title('Используется для парсинга')]
    #[ORM\Column(options: ['default' => false])]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public bool $usingForParsing = false;

    #[Title('Созданная парсером нагрузка')]
    #[ORM\Column(options: ['default' => 0])]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public int $parserLoad = 0;
}
