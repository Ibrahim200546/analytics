<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use DateTimeImmutable;
use Dexodus\SmiParserInterface\Repository\ArticleRepository;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
    ]
)]
#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[AsTSType(groups: [self::GROUP_LIST])]
class Article
{
    public const GROUP_LIST = 'Article:list';

    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups([self::GROUP_LIST])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST])]
    public string $parser;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST])]
    public string $source;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST])]
    public string $originalPath;

    #[ORM\Column(nullable: true)]
    #[Groups([self::GROUP_LIST])]
    public ?string $imageUrl = null;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST])]
    public string $title;

    #[ORM\Column(type: 'text')]
    #[Groups([self::GROUP_LIST])]
    public string $content;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups([self::GROUP_LIST])]
    public ?string $announce = null;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST])]
    public DateTimeImmutable $startTracked;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST])]
    public DateTimeImmutable $lastUpdate;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST])]
    public DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, ArticleComment>
     */
    #[ORM\OneToMany(mappedBy: 'comments', targetEntity: ArticleComment::class)]
    public Collection $comments;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function __construct()
    {
        $this->startTracked = new DateTimeImmutable();
        $this->lastUpdate = new DateTimeImmutable();
        $this->createdAt = new DateTimeImmutable();
        $this->comments = new ArrayCollection();
    }
}
