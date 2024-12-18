<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Entity;

use Dexodus\EntityHistoryBundle\Repository\EntityHistoryChangeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EntityHistoryChangeRepository::class)]
class EntityHistoryChange
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: EntityHistory::class, inversedBy: 'changes')]
    public EntityHistory $entityHistory;

    #[ORM\Column]
    public string $propertyName;

    #[ORM\Column(type: 'json', nullable: true)]
    public mixed $oldValue;

    #[ORM\Column(type: 'json', nullable: true)]
    public mixed $newValue;
}
