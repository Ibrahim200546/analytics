<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Dexodus\WebResourceBundle\State\WebResourceProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: WebResourceRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]], processor: WebResourceProcessor::class),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]], processor: WebResourceProcessor::class),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [new Edit()])]
#[AsTSType(groups: [self::ROLE_VIEW])]
class WebResource
{
    public const ROLE_CREATE = 'WebResource.create';
    public const ROLE_EDIT = 'WebResource.edit';
    public const ROLE_VIEW = 'WebResource.view';
    public const ROLE_LIST = 'WebResource.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE, self::ROLE_EDIT])]
    #[Title('Имя ресурса')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    #[EntityTableColumn]
    public string $name;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE, self::ROLE_EDIT])]
    #[Title('Ссылка на список новостей')]
    #[Assert\NotBlank(message: 'Поле должно быть заполнено')]
    public string $listArticlesLink;
    #[ORM\Column]
    public string $articleLinkCssPath;
    #[ORM\Column]
    public string $containerCssPath;
    #[ORM\Column]
    public string $articlesPathPattern;
    #[ORM\Column]
    public string $titleCssPath;
    #[ORM\Column(nullable: true)]
    public ?string $announceCssPath = null;
    #[ORM\Column]
    public string $contentCssPath;
    #[ORM\Column(nullable: true)]
    public ?string $createdAtCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $imageCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $createdAtFormat = null;
    #[ORM\Column(nullable: true)]
    public ?string $faviconUrl = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentsContainerCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentContainerCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentCommentatorNameCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentContentCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentLikesCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentDislikesCssPath = null;
    #[ORM\Column(nullable: true)]
    public ?string $commentCreatedAtCssPath = null;
}
