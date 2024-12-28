<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use Dexodus\FileBundle\Repository\FileMemberRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FileMemberRepository::class)]
#[ApiResource]
class FileMember
{
    public const ROLE_READ = 'ROLE_READ';
    public const ROLE_INVITE = 'ROLE_INVITE';
    public const ROLE_SIGN = 'ROLE_SIGN';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['id.view', 'Default'])]
    private ?int $id = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\ManyToOne(inversedBy: 'members')]
    #[ORM\JoinColumn(nullable: false)]
    public File $file;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    public UserInterface $user;

    public function getRoles(): array
    {
        $roles = [self::ROLE_READ];

        if ($this->file->owner === $this->user) {
            $roles[] = self::ROLE_INVITE;
            $roles[] = self::ROLE_SIGN;
        }

        return array_merge(array_diff($this->roles, $roles), $roles);
    }

    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
