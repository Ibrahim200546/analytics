<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]]),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
class ArticleComment
{
    public const ROLE_CREATE = 'ArticleComment.create';
    public const ROLE_EDIT = 'ArticleComment.edit';
    public const ROLE_VIEW = 'ArticleComment.view';
    public const ROLE_LIST = 'ArticleComment.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'comments')]
    public ?Article $article = null;

    #[ORM\ManyToOne(targetEntity: ArticleComment::class, inversedBy: 'replies')]
    public ?ArticleComment $reply = null;

    #[ORM\OneToMany(mappedBy: 'reply', targetEntity: ArticleComment::class)]
    public Collection $replies;

    #[ORM\Column]
    public string $commentatorName;

    #[ORM\Column(type: 'text')]
    public string $content;

    #[ORM\Column(options: ['default' => 0])]
    public int $likes = 0;

    #[ORM\Column(options: ['default' => 0])]
    public int $dislikes = 0;

    #[ORM\Column]
    public ?string $createdAtString;

    #[ORM\Column(options: ['default' => false])]
    public bool $deletedFromSource = false;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    public DateTimeImmutable $startTrackedAt;

    public function __construct()
    {
        $this->replies = new ArrayCollection();
        $this->startTrackedAt = new DateTimeImmutable();
    }
}
