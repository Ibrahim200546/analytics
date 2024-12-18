<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\User;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\TranslationApiBundle\Repository\TranslationUnitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TranslationUnitRepository::class), ORM\Table(name: 'ta_translation_unit')]
#[ApiResource]
class TranslationUnit
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $id = null;

    #[ORM\ManyToOne]
    public Translation $translation;

    #[ORM\ManyToOne]
    #[Groups(['translation.create', 'translation.edit', 'translation.view'])]
    #[EntityFormField(type: EntityFormFieldTypeEnum::ASYNC_ENUM, componentArguments: ['label' => 'locale'])]
    public Locale $locale;

    #[ORM\Column(type: 'text')]
    #[Groups(['translation.create', 'translation.edit', 'translation.view'])]
    public string $value;

    #[Groups(['translation.view'])]
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    public DateTimeImmutable $createdAt;

    #[ORM\ManyToOne]
    public ?User $creator;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
