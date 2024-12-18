<?php

declare(strict_types=1);

namespace Dexodus\LocationBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
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
use Dexodus\TitleBundle\Attribute\Title;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'ipartial'])]
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
class Region
{
    public const ROLE_CREATE = 'Region.create';
    public const ROLE_EDIT = 'Region.edit';
    public const ROLE_VIEW = 'Region.view';
    public const ROLE_LIST = 'Region.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups(['location', self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    /**
     * @var Collection<int, District>
     */
    #[ORM\OneToMany(mappedBy: 'region', targetEntity: District::class)]
    public Collection $districts;

    #[ORM\Column]
    #[Groups(['location', self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_LIST])]
    #[Title('Название области')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn]
    public string $name;
}
