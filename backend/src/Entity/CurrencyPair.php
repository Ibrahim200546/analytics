<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\CurrencyPairRepository;
use DateTimeImmutable;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Doctrine\ORM\Mapping as ORM;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CurrencyPairRepository::class)]
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
class CurrencyPair implements WithDisableInterface
{
    use EntityDisableTrait;

    public const ROLE_CREATE = 'CurrencyPair.create';
    public const ROLE_EDIT = 'CurrencyPair.edit';
    public const ROLE_VIEW = 'CurrencyPair.view';
    public const ROLE_LIST = 'CurrencyPair.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn('general.id')]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: TrackedCurrency::class, inversedBy: 'sellCurrencyPairs')]
    #[Groups([self::ROLE_VIEW])]
    public TrackedCurrency $sellCurrency;

    #[ORM\ManyToOne(targetEntity: TrackedCurrency::class, inversedBy: 'buyCurrencyPairs')]
    #[Groups([self::ROLE_VIEW])]
    public TrackedCurrency $buyCurrency;

    #[ORM\Column]
    #[Groups([self::ROLE_VIEW])]
    public float $price;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    public readonly DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
