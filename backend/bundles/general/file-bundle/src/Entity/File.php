<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Entity\User;
use DateTime;
use Dexodus\FileBundle\Repository\FileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(normalizationContext: ['groups' => File::FILE_GROUP])]
#[ORM\Entity(repositoryClass: FileRepository::class)]
class File implements JsonSerializable
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups([File::FILE_GROUP])]
    private ?int $id = null;

    public const FILE_GROUP = 'file';

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column]
    public string $name;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column(nullable: true)]
    public ?string $originalName;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column]
    public string $extension;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column]
    public string $path;

    #[ORM\Column(nullable: true)]
    public ?string $ncaPath;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column(nullable: true)]
    public ?string $mimeType = null;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column]
    public DateTime $savedAt;

    #[Groups([File::FILE_GROUP])]
    #[ORM\Column]
    public bool $isTemp = false;

    #[ORM\ManyToOne]
    public ?User $owner;

    /** @var Collection<int, FileMember> */
    #[ORM\OneToMany(mappedBy: 'file', targetEntity: FileMember::class, orphanRemoval: true)]
    public Collection $members;

    /** @var Collection<int, FileHistory> */
    #[ORM\OneToMany(mappedBy: 'file', targetEntity: FileHistory::class, orphanRemoval: true)]
    public Collection $histories;

    private ?string $temporaryUrl = null;

    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->histories = new ArrayCollection();
        $this->savedAt = new DateTime();
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->name,
            'extension' => $this->extension,
            'path' => $this->path,
            'mimeType' => $this->mimeType,
            'savedAt' => $this->savedAt,
            'isTemp' => $this->isTemp,
        ];
    }

    #[Groups(['file'])]
    public function getTemporaryUrl(): ?string
    {
        return $this->temporaryUrl;
    }

    public function setTemporaryUrl(?string $temporaryUrl): void
    {
        $this->temporaryUrl = $temporaryUrl;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOriginalName(): string
    {
        return $this->originalName ?? $this->name;
    }
}
