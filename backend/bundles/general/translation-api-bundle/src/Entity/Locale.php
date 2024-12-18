<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TranslationApiBundle\Repository\LocaleRepository;
use Dexodus\TranslationApiBundle\State\LocaleProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LocaleRepository::class), ORM\Table(name: 'ta_locale')]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => 'locale.create', 'security' => 'is_granted("ROLE_TRANSLATE")'], processor: LocaleProcessor::class),
    new Put(denormalizationContext: ['groups' => 'locale.edit', 'security' => 'is_granted("ROLE_TRANSLATE")']),
    new Get(normalizationContext: ['groups' => 'locale.view', 'security' => 'is_granted("ROLE_TRANSLATE")']),
    new GetCollection(normalizationContext: ['groups' => 'locale.view', 'security' => 'is_granted("ROLE_TRANSLATE")']),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', ['locale.create']),
    new EntityFormMode('edit', ['locale.edit']),
    new EntityFormMode('view', ['locale.view']),
])]
#[EntityTable]
class Locale
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['locale.view'])]
    #[EntityTableColumn]
    #[Title('ID')]
    public readonly int $id;

    #[Groups(['locale.create', 'locale.view', 'locale.edit', 'translation.view'])]
    #[ORM\Column]
    #[EntityTableColumn]
    #[Title('general.locale')]
    public string $locale;

    #[ORM\ManyToOne(cascade: ['persist'])]
    public Translation $translation;
}
