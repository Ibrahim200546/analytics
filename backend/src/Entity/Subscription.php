<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\Entity\SubscriptionTypeEnum;
use App\State\DeleteSubscriptionProcessor;
use DateTimeImmutable;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Delete(processor: DeleteSubscriptionProcessor::class),
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]]),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
#[AsTSType(groups: [Organization::ROLE_VIEW])]
class Subscription implements WithDisableInterface
{
    use EntityDisableTrait;

    public const ROLE_CREATE = 'Subscription.create';
    public const ROLE_EDIT = 'Subscription.edit';
    public const ROLE_VIEW = 'Subscription.view';
    public const ROLE_LIST = 'Subscription.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[Groups([self::ROLE_CREATE])]
    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'subscriptions')]
    public ?Organization $organization = null;

    #[ORM\Column]
    #[Title('Тип подписки')]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public SubscriptionTypeEnum $type;

    #[ORM\Column]
    #[Title('Дата начала подписки')]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public DateTimeImmutable $start;

    #[ORM\Column('`end`')]
    #[Title('Дата окончания подписки')]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public DateTimeImmutable $end;

    #[ORM\Column(options: ['default' => false])]
    #[Title('Активирована')]
    #[Groups([Organization::ROLE_VIEW])]
    public bool $active = false;

    #[ORM\Column(nullable: true)]
    #[Title('Цена')]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public ?int $price = null;

    #[ORM\Column(nullable: true)]
    #[Title('Сколько уйдёт на развитие проекта')]
    #[Groups([Organization::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public ?int $priceForProjectImprovements = null;
}
