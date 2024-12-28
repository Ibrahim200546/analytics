<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use DateTimeImmutable;
use Dexodus\FileBundle\Entity\File;
use Dexodus\SmiParserBundle\Repository\ArticleRepository;
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
#[AsTSType(groups: [self::GROUP_LIST, File::FILE_GROUP])]
class Article
{
    public const GROUP_LIST = 'Article:list';
    public const GROUP_VIEW = 'Article:view';

    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'replies')]
    public ?Article $reply = null;

    #[ORM\OneToMany(mappedBy: 'reply', targetEntity: Article::class)]
    public Collection $replies;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public string $parser;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public string $source;

    #[ORM\Column]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public string $originalPath;

    #[ORM\Column(nullable: true)]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public ?string $imageUrl = null;

    #[ORM\ManyToOne]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public ?File $image = null;

    #[ORM\Column(type: 'text')]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public string $title;

    #[ORM\Column(type: 'text')]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public string $content;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public ?string $announce = null;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public DateTimeImmutable $startTracked;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public DateTimeImmutable $lastUpdate;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, ArticleComment>
     */
    #[ORM\OneToMany(mappedBy: 'article', targetEntity: ArticleComment::class)]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public Collection $comments;

    #[ORM\Column(options: ['default' => false])]
    public bool $isScheduledForUpdate = false;

    #[ORM\Column(options: ['default' => false])]
    #[Groups([self::GROUP_LIST, self::GROUP_VIEW])]
    public bool $canReply = false;

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
        $this->replies = new ArrayCollection();
    }
}
