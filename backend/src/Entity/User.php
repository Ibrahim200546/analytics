<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\IdTrait;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\UserRepository;
use App\State\User\AdminProcessor;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityHistoryBundle\Attribute\HideFromHistory;
use Dexodus\EntityHistoryBundle\Entity\WithHistoryInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
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
#[ApiResource(
    operations: [
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
    ],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, WithHistoryInterface, WithDisableInterface
{
    public const ADMIN_FORM_NAME = 'app.entity.user:admin';
    public const GROUP_CREATE_ADMIN = 'app.entity.user:admin_create';
    public const GROUP_EDIT_ADMIN = 'app.entity.user:admin_edit';
    public const GROUP_VIEW_ADMIN = 'app.entity.user:admin_view';
    public const GROUP_LIST_ADMIN = 'app.entity.user:admin_list';

    use IdTrait;
    use EntityDisableTrait;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::GROUP_CREATE_ADMIN, self::GROUP_EDIT_ADMIN, self::GROUP_LIST_ADMIN, self::GROUP_VIEW_ADMIN,])]
    #[EntityTableColumn]
    #[Priority(1)]
    #[Assert\Email(message: 'Не правильный формат почты')]
    #[Title('Почта')]
    private string $email;

    /** @var UserRoleEnum[] */
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

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

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
