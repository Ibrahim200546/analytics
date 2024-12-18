<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\SmiParserInterface\Entity\Article;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Patch(denormalizationContext: ['groups' => [self::ROLE_TOGGLE_FAVORITE]]),
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]]),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(uriTemplate: '/project-articles/{project}', uriVariables: ['project'], normalizationContext: ['groups' => [self::ROLE_ORGANIZATION_MEMBER_LIST, Article::GROUP_LIST]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
#[AsTSType(groups: [self::ROLE_ORGANIZATION_MEMBER_LIST, Article::GROUP_LIST])]
class ProjectArticle
{
    public const ROLE_CREATE = 'ProjectArticle.create';
    public const ROLE_EDIT = 'ProjectArticle.edit';
    public const ROLE_VIEW = 'ProjectArticle.view';
    public const ROLE_LIST = 'ProjectArticle.list';
    public const ROLE_ORGANIZATION_MEMBER_LIST = 'ProjectArticle.organizationMemberList';
    public const ROLE_TOGGLE_FAVORITE = 'ProjectArticle.toggleFavorite';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_ORGANIZATION_MEMBER_LIST])]
    private int $id;

    #[Groups([self::ROLE_ORGANIZATION_MEMBER_LIST])]
    #[ORM\ManyToOne(targetEntity: Article::class)]
    public Article $article;

    #[ORM\ManyToOne(targetEntity: Project::class, inversedBy: 'articles')]
    public Project $project;

    #[ORM\Column(options: ['default' => false])]
    #[Groups([self::ROLE_VIEW, self::ROLE_ORGANIZATION_MEMBER_LIST, self::ROLE_TOGGLE_FAVORITE])]
    public bool $favorite = false;

    public function getId(): int
    {
        return $this->id;
    }
}
