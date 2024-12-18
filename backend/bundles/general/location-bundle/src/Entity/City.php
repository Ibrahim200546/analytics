<?php

declare(strict_types=1);

namespace Dexodus\LocationBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Attribute\EntityFormField;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\EntityTableBundle\Filter\SearchCustomFieldFilter;
use Dexodus\TitleBundle\Attribute\Title;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(SearchCustomFieldFilter::class, properties: ['fullName' => "o.district.region.name + ', ' + o.district.name + ', ' + o.name"])]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]]),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW, District::ROLE_VIEW, Region::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST, District::ROLE_LIST, Region::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
class City
{
    public const ROLE_CREATE = 'City.create';
    public const ROLE_EDIT = 'City.edit';
    public const ROLE_VIEW = 'City.view';
    public const ROLE_LIST = 'City.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups(['location', self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: District::class, inversedBy: 'cities')]
    #[Groups(['location', self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_LIST])]
    #[EntityFormField(type: EntityFormFieldTypeEnum::ASYNC_ENUM, component: EntityFormFieldComponentEnum::ASYNC_DROPDOWN_FIELD, componentArguments: [
        'label' => 'region.name + ", " + name',
        'search' => 'fullName',
    ])]
    #[Title('Район')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn('entity.district.name')]
    public ?District $district = null;

    #[ORM\Column]
    #[Groups(['location', self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_LIST])]
    #[Title('Название города')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn]
    public string $name;
}
