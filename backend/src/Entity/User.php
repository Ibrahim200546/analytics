<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\IdTrait;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\UserRepository;
use App\State\User\AdminProcessor;
use App\State\User\CreateEmployeeProcessor;
use App\State\User\CreateSupervisorProcessor;
use App\State\User\EditEmployeeProcessor;
use App\State\User\EditSupervisorProcessor;
use App\State\User\EmployeesProvider;
use App\State\User\MeUserProvider;
use App\State\User\RemoveEmployeeProcessor;
use App\State\User\RemoveSupervisorFromOrganizationProcessor;
use App\State\User\SupervisorsProvider;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityHistoryBundle\Attribute\HideFromHistory;
use Dexodus\EntityHistoryBundle\Entity\WithHistoryInterface;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Action\FrontendAction;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[EntityForm(
    self::ADMIN_FORM_NAME,
    modes: [
        new EntityFormMode('create', groups: [self::GROUP_CREATE_ADMIN]),
        new EntityFormMode('edit', groups: [self::GROUP_EDIT_ADMIN]),
    ],
    paths: [
        'create' => '/api/users/admins',
        'edit' => '/api/users/admins/{id}',
        'get' => '/api/users/admins/{id}',
        'collection' => '/api/users/admins',
    ]
)]
#[EntityTable(self::ADMIN_FORM_NAME, actions: [new Edit()], path: '/api/users/admins')]
#[EntityTable(self::EMPLOYEES_TABLE_NAME, actions: [new FrontendAction('Изменить', 'showEditModal(entity.id)'), new FrontendAction('Удалить', 'showDeleteModal(entity.id)', ActionStyleEnum::Danger)], path: '/api/users/employees')]
#[ApiResource(
    operations: [
        new Delete(
            uriTemplate: '/users/remove-supervisor/{id}',
            denormalizationContext: ['groups' => [
                self::GROUP_CREATE_ADMIN,
            ]],
            processor: RemoveSupervisorFromOrganizationProcessor::class
        ),
        new Put(
            uriTemplate: '/users/edit-supervisor/{id}',
            denormalizationContext: ['groups' => [
                self::GROUP_EDIT_ADMIN,
            ]],
            processor: EditSupervisorProcessor::class
        ),
        new Post(
            uriTemplate: '/users/create-supervisor',
            denormalizationContext: ['groups' => [
                self::GROUP_CREATE_ADMIN,
            ]],
            processor: CreateSupervisorProcessor::class
        ),
        new GetCollection(
            uriTemplate: '/users/supervisors',
            normalizationContext: ['groups' => [
                self::GROUP_VIEW_PROFILE,
                self::ID_VIEW,
            ]],
            provider: SupervisorsProvider::class,
        ),
        new Delete(
            uriTemplate: '/users/remove-employee/{id}',
            denormalizationContext: ['groups' => [
                self::GROUP_CREATE_ADMIN,
            ]],
            processor: RemoveEmployeeProcessor::class
        ),
        new Put(
            uriTemplate: '/users/edit-employee/{id}',
            denormalizationContext: ['groups' => [
                self::GROUP_EDIT_ADMIN,
            ]],
            processor: EditEmployeeProcessor::class
        ),
        new Post(
            uriTemplate: '/users/create-employee',
            denormalizationContext: ['groups' => [
                self::GROUP_CREATE_ADMIN,
            ]],
            processor: CreateEmployeeProcessor::class
        ),
        new GetCollection(
            uriTemplate: '/users/employees',
            normalizationContext: ['groups' => [
                self::GROUP_VIEW_PROFILE,
                self::ID_VIEW,
            ]],
            provider: EmployeesProvider::class,
        ),
        new Get(
            uriTemplate: '/users/employees/{id}',
            normalizationContext: ['groups' => [
                self::GROUP_VIEW_PROFILE,
                self::ID_VIEW,
            ]],
        ),
        // Admin operations
        new Post(
            uriTemplate: '/users/admins',
            denormalizationContext: ['groups' => [
                self::GROUP_CREATE_ADMIN,
            ]],
            processor: AdminProcessor::class
        ),
        new Put(
            uriTemplate: '/users/admins/{id}',
            denormalizationContext: ['groups' => [
                self::GROUP_EDIT_ADMIN,
            ]],
            processor: AdminProcessor::class
        ),
        new Get(
            uriTemplate: '/users/admins/{id}',
            normalizationContext: ['groups' => [
                self::GROUP_VIEW_ADMIN,
                self::ID_VIEW,
            ]],
        ),
        new GetCollection(
            uriTemplate: '/users/admins',
            normalizationContext: ['groups' => [
                self::GROUP_LIST_ADMIN,
                self::ID_VIEW,
            ]],
        ),
        new Get(
            uriTemplate: '/users/me',
            normalizationContext: ['groups' => [
                self::GROUP_VIEW_PROFILE,
                self::ID_VIEW,
            ]],
            provider: MeUserProvider::class,
        ),
    ],
)]
#[AsTSType(groups: [self::GROUP_VIEW_PROFILE, self::ID_VIEW])]
class User implements UserInterface, PasswordAuthenticatedUserInterface, WithHistoryInterface, WithDisableInterface
{
    public const ADMIN_FORM_NAME = 'app.entity.user:admin';
    public const GROUP_CREATE_ADMIN = 'app.entity.user:admin_create';
    public const GROUP_EDIT_ADMIN = 'app.entity.user:admin_edit';
    public const GROUP_VIEW_ADMIN = 'app.entity.user:admin_view';
    public const GROUP_LIST_ADMIN = 'app.entity.user:admin_list';
    public const GROUP_VIEW_PROFILE = 'app.entity.user:view_profile';
    public const EMPLOYEES_TABLE_NAME = 'app.entity.user:employee';

    use IdTrait;
    use EntityDisableTrait;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN, self::GROUP_LIST_ADMIN, self::GROUP_VIEW_ADMIN, self::GROUP_VIEW_PROFILE])]
    #[EntityTableColumn]
    #[Priority(1)]
    #[Assert\Email(message: 'Не правильный формат почты')]
    #[Title('Почта')]
    private string $email;

    /** @var UserRoleEnum[] */
    #[Groups([self::GROUP_VIEW_PROFILE])]
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    #[HideFromHistory]
    private ?string $password = null;

    #[Groups([self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN])]
    #[Title('Пароль')]
    #[Assert\Regex("/.{6,}/", message: "Пароль должен иметь длину минимум 6 символов", groups: [self::GROUP_CREATE_ADMIN])]
    #[Assert\Regex("/^(.{6,}|)$/", message: "Пароль должен иметь длину минимум 6 символов", groups: [self::GROUP_EDIT_ADMIN])]
    public ?string $plainPassword = null;

    #[ORM\Column(options: ['default' => ''])]
    #[Groups([self::GROUP_VIEW_PROFILE, self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN])]
    public string $firstName;

    #[ORM\Column(options: ['default' => ''])]
    #[Groups([self::GROUP_VIEW_PROFILE, self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN])]
    public string $lastName;

    #[ORM\Column(options: ['default' => ''])]
    #[Groups([self::GROUP_VIEW_PROFILE, self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN])]
    public string $patronymic;

    #[ORM\Column(options: ['default' => ''])]
    #[Groups([self::GROUP_VIEW_PROFILE, self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN])]
    public string $iin;

    /**
     * @var Collection<int, Organization>
     */
    #[ORM\OneToMany(mappedBy: 'supervisor', targetEntity: Organization::class)]
    public Collection $organizationsWhenSupervisor;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'employees')]
    public ?Organization $organizationWhenWorked;

    public function __construct()
    {
        $this->organizationsWhenSupervisor = new ArrayCollection();
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;

        $roles[] = UserRoleEnum::ROLE_USER->value;

        return array_unique($roles);
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->getRoles());
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function addRole(string $role): static
    {
        $this->roles = array_unique([...$this->getRoles(), $role]);

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
    }
}
