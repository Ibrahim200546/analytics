<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\User;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\TranslationApiBundle\Enum\TranslationCreationTypeEnum;
use Dexodus\TranslationApiBundle\Repository\TranslationRepository;
use Dexodus\TranslationApiBundle\State\TranslationProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TranslationRepository::class), ORM\Table(name: 'ta_translation')]
#[EntityForm(modes: [
    new EntityFormMode('create', ['translation.create']),
    new EntityFormMode('edit', ['translation.edit', 'translation.view']),
])]
#[EntityTable(actions: [new Edit()])]
#[ApiFilter(SearchFilter::class, properties: ['key' => 'ipartial', ''])]
#[ApiResource(operations: [
    new Post(
        normalizationContext: ['groups' => ['translation.view']],
        denormalizationContext: ['groups' => ['translation.create']],
        processor: TranslationProcessor::class,
    ),
    new Put(
        normalizationContext: ['groups' => ['translation.view']],
        denormalizationContext: ['groups' => ['translation.edit']],
    ),
    new Get(
        normalizationContext: ['groups' => ['translation.view']]
    ),
    new GetCollection(
        normalizationContext: ['groups' => ['translation.view']]
    ),
])]
class Translation
{
    #[Groups(['translation.view'])]
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Title('ID')]
    public readonly int $id;

    #[ORM\Column(type: 'text', unique: true)]
    #[Groups(['translation.create', 'locale.create', 'translation.view'])]
    #[EntityTableColumn]
    #[Title('translation.key')]
    public string $key;

    #[ORM\Column]
    #[Groups(['translation.view'])]
    #[EntityTableColumn]
    #[Title('translation.creationType')]
    public TranslationCreationTypeEnum $creationType;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups(['translation.view'])]
    #[EntityTableColumn]
    #[Title('general.createdAt')]
    public DateTimeImmutable $createdAt;

    #[ORM\ManyToOne]
    public ?User $creator;

    /** @var Collection<int, TranslationUnit> */
    #[Assert\Valid]
    #[ORM\OneToMany(mappedBy: 'translation', targetEntity: TranslationUnit::class, cascade: ['persist'], orphanRemoval: true)]
    #[Groups(['translation.create', 'translation.edit', 'translation.view'])]
    #[EntityTableColumn(' result = ""; foreach (entity.units as unit) { result = result + " " + unit.locale.locale + ": " + unit.value + "; "; } result ')]
    public Collection $units;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->units = new ArrayCollection();
    }

    /** @return Collection<int, TranslationUnit> */
    public function getUnits(): Collection
    {
        return $this->units;
    }

    public function addUnit(TranslationUnit $unit): void
    {
        $this->units->add($unit);
        $unit->translation = $this;
    }

    public function removeUnit(TranslationUnit $unit): void
    {
        $this->units->removeElement($unit);
    }
}
