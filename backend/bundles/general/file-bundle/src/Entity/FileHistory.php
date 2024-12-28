<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use DateTimeImmutable;
use Dexodus\FileBundle\Repository\FileHistoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FileHistoryRepository::class)]
#[ApiResource]
class FileHistory
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['id.view', 'Default'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'histories')]
    #[ORM\JoinColumn(nullable: false)]
    public File $file;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    public UserInterface $initiator;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    public readonly DateTimeImmutable $createdAt;

    #[ORM\Column(length: 255)]
    public ?string $action = null;

    #[ORM\Column(nullable: true)]
    public array $data = [];

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
