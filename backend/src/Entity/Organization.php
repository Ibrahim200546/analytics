<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\TimestampTrait;
use App\Repository\OrganizationRepository;
use App\State\MyOrganizationsProvider;
use App\State\OrganizationProcessor;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Attribute\EntityFormField;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Action\RouterPush;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\LocationBundle\Entity\City;
use Dexodus\SingleUniqueBundle\Attribute\SingleUnique;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: OrganizationRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new GetCollection(uriTemplate: '/organizations/my', normalizationContext: ['groups' => [self::ROLE_LIST, 'location']], provider: MyOrganizationsProvider::class),
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]], processor: OrganizationProcessor::class),
    new Put(uriTemplate: '/organizations/set-supervisor/{id}', denormalizationContext: ['groups' => [self::ROLE_SET_SUPERVISOR]]),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]], processor: OrganizationProcessor::class),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW, 'location', 'timestamp:createdAt', User::GROUP_VIEW_PROFILE, User::ID_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST, 'location']]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_FORM_EDIT]),
])]
#[EntityTable(actions: [new Edit(), new RouterPush('Подробнее', '"/admin/organizations/view/" + entity.id')])]
#[AsTSType(groups: [self::ROLE_VIEW, 'location', 'timestamp:createdAt', User::GROUP_VIEW_PROFILE, User::ID_VIEW])]
class Organization
{
    use TimestampTrait {
        TimestampTrait::__construct as private timestampConstruct;
    }

    public const ROLE_CREATE = 'Organization.create';
    public const ROLE_EDIT = 'Organization.edit';
    public const ROLE_FORM_EDIT = 'Organization.form_edit';
    public const ROLE_SET_SUPERVISOR = 'Organization.set_supervisor';
    public const ROLE_VIEW = 'Organization.view';
    public const ROLE_LIST = 'Organization.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, OrganizationAccount::ROLE_VIEW])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: City::class)]
    #[Groups([self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_FORM_EDIT, self:: ROLE_LIST])]
    #[Title('Город')]
    #[EntityFormField(type: EntityFormFieldTypeEnum::ASYNC_ENUM, component: EntityFormFieldComponentEnum::ASYNC_DROPDOWN_FIELD, componentArguments: [
        'label' => 'district.region.name + ", " + district.name + ", " + name',
        'search' => 'fullName',
    ])]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn('entity.city.district.region.name + ", " + entity.city.district.name + ", " + entity.city.name')]
    public City $city;

    #[ORM\Column]
    #[Groups([self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_FORM_EDIT, self:: ROLE_LIST])]
    #[Title('Название организации')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn]
    public string $name;

    #[ORM\Column]
    #[Groups([self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_FORM_EDIT, self:: ROLE_LIST])]
    #[Title('БИН')]
    #[Assert\Regex(pattern: '/^\d{12}$/', message: 'Не правильный формат поля. В поле должны быть 12 цифр')]
    #[EntityFormField(componentArguments: ['mask' => '############'])]
    #[SingleUnique(message: 'Организация с таким значением БИН уже существует. Возможно ваша организация является филиалом, для этого необходимо выставить галочку, что это филиал')]
    #[EntityTableColumn]
    public string $bin;

    #[Groups([self::ROLE_VIEW])]
    public ?Subscription $subscription = null;

    /**
     * @var Collection<int, Subscription>
     */
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Subscription::class)]
    public Collection $subscriptions;

    /**
     * @var Collection<int, Project>
     */
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Project::class)]
    public Collection $projects;

    #[ORM\ManyToOne(targetEntity: User::class)]
    public ?User $creator = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'organizationsWhenSupervisor')]
    #[Groups([self::ROLE_VIEW, self::ROLE_SET_SUPERVISOR])]
    public ?User $supervisor = null;

    #[ORM\OneToMany(mappedBy: 'organizationWhenWorked', targetEntity: User::class)]
    public Collection $employees;

    #[ORM\Column(options: ['default' => 10])]
    #[Groups([self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_FORM_EDIT, self:: ROLE_LIST])]
    #[Title('Лимит сотрудников')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    public int $limitEmployees;

    #[ORM\Column(options: ['default' => 5])]
    #[Groups([self::ROLE_CREATE, self::ROLE_EDIT, self::ROLE_VIEW, self::ROLE_FORM_EDIT, self:: ROLE_LIST])]
    #[Title('Лимит проектов')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    public int $limitProjects;

    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: OrganizationAccount::class)]
    public Collection $accounts;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->subscriptions = new ArrayCollection();
        $this->projects = new ArrayCollection();
        $this->employees = new ArrayCollection();
        $this->accounts = new ArrayCollection();
        $this->timestampConstruct();
    }

    public function getSubscription(): ?Subscription
    {
        $subscription = $this->subscriptions->first();

        if ($subscription instanceof Subscription) {
            return $subscription;
        }

        return null;
    }
}
