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
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
class InstagramAccount
{
    public const ROLE_CREATE = 'InstagramAccount.create';
    public const ROLE_EDIT = 'InstagramAccount.edit';
    public const ROLE_VIEW = 'InstagramAccount.view';
    public const ROLE_LIST = 'InstagramAccount.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE, self::ROLE_EDIT])]
    public string $login;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_CREATE, self::ROLE_EDIT])]
    public string $password;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'account', targetEntity: InstagramAccountCookie::class)]
    public Collection $cookies;

    public function __construct()
    {
        $this->cookies = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
    }
}
