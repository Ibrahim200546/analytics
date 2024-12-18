<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete as ApiPlatformDelete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\TimestampTrait;
use App\Repository\ProjectRepository;
use App\State\CreateProjectProcessor;
use App\State\DeleteProjectProcessor;
use App\State\ProjectsForMyOrganizationProvider;
use DateTimeImmutable;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityDisableBundle\EntityTable\Action\Delete;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Action\FrontendAction;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ['organization' => 'exact'])]
#[ApiResource(operations: [
    new GetCollection(uriTemplate: '/projects/for-my-organization', normalizationContext: ['groups' => [self::ROLE_LIST]], provider: ProjectsForMyOrganizationProvider::class),
    new ApiPlatformDelete(processor: DeleteProjectProcessor::class),
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]], processor: CreateProjectProcessor::class),
    new Put(denormalizationContext: ['groups' => [self::ROLE_EDIT]]),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
    new EntityFormMode('edit', [self::ROLE_EDIT]),
])]
#[EntityTable(actions: [
    new FrontendAction('Изменить', 'showEditProjectModal(entity.id)'),
    new FrontendAction('Удалить', 'showDeleteProjectModal(entity.id)', ActionStyleEnum::Danger)
])]
#[AsTSType(groups: [self::ROLE_VIEW])]
class Project implements WithDisableInterface
{
    use TimestampTrait;
    use EntityDisableTrait;

    public const ROLE_CREATE = 'Project.create';
    public const ROLE_EDIT = 'Project.edit';
    public const ROLE_VIEW = 'Project.view';
    public const ROLE_LIST = 'Project.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'projects')]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_CREATE])]
    public Organization $organization;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_EDIT, self::ROLE_CREATE])]
    #[Title('Имя проекта')]
    #[EntityTableColumn]
    public string $name;

    /**
     * @var string[]
     */
    #[ORM\Column(type: 'json')]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST, self::ROLE_EDIT, self::ROLE_CREATE])]
    public array $tags = [];

    /**
     * @var Collection<int, ProjectArticle>
     */
    #[ORM\OneToMany(mappedBy: 'project', targetEntity: ProjectArticle::class)]
    public Collection $articles;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->editedAt = new DateTimeImmutable();
        $this->articles = new ArrayCollection();
    }
}
