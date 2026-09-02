<?php

declare(strict_types=1);

namespace Dexodus\InstagramParserBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
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
class InstagramAccountCookie
{
    public const ROLE_CREATE = 'InstagramAccountCookie.create';
    public const ROLE_EDIT = 'InstagramAccountCookie.edit';
    public const ROLE_VIEW = 'InstagramAccountCookie.view';
    public const ROLE_LIST = 'InstagramAccountCookie.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn('general.id')]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: InstagramAccount::class, inversedBy: 'cookies')]
    public InstagramAccount $account;
}
