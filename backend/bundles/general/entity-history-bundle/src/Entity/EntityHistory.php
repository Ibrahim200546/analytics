<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Entity;

use DateTimeImmutable;
use Dexodus\EntityHistoryBundle\Repository\EntityHistoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: EntityHistoryRepository::class)]
class EntityHistory
{
    public const ROLE_CREATE = 'EntityHistory.create';
    public const ROLE_EDIT = 'EntityHistory.edit';
    public const ROLE_VIEW = 'EntityHistory.view';
    public const ROLE_LIST = 'EntityHistory.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    public readonly int $id;

    #[ORM\Column]
    public string $entityClass;

    #[ORM\Column(type: 'json')]
    public mixed $entityId;

    #[ORM\ManyToOne]
    public ?UserInterface $user;

    #[ORM\Column]
    public DateTimeImmutable $createdAt;

    /** @var Collection<int, EntityHistoryChange> */
    #[ORM\OneToMany(mappedBy: 'entityHistory', targetEntity: EntityHistoryChange::class)]
    public Collection $changes;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->changes = new ArrayCollection();
    }

    public function isHistoryAboutCreating(): bool
    {
        return $this->changes->isEmpty();
    }
}
