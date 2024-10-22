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
use App\Action\DisableTrackedCurrency;
use App\Enum\CurrencyCodeEnum;
use App\Repository\TrackedCurrencyRepository;
use App\Service\CurrencyViewer;
use App\State\TrackedCurrencyProcessor;
use DateTimeImmutable;
use Dexodus\EntityDisableBundle\Entity\EntityDisableTrait;
use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Attribute\EntityFormField;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Action\BackendAction;
use Dexodus\EntityTableBundle\Action\Edit;
use Dexodus\EntityTableBundle\Action\RouterPush;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Attribute\Title;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TrackedCurrencyRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiResource(operations: [
    new Post(denormalizationContext: ['groups' => [self::ROLE_CREATE]], processor: TrackedCurrencyProcessor::class),
    new Get(normalizationContext: ['groups' => [self::ROLE_VIEW]]),
    new GetCollection(normalizationContext: ['groups' => [self::ROLE_LIST]]),
])]
#[EntityForm(modes: [
    new EntityFormMode('create', [self::ROLE_CREATE]),
])]
#[EntityTable(actions: [
    new RouterPush(
        'Просмотреть курс',
        '"/admin/currencies/" + entity.id',
        ActionStyleEnum::Primary,
    ),
    new BackendAction(
        'Удалить из отслеживаемых',
        DisableTrackedCurrency::class,
        style: ActionStyleEnum::Danger,
        confirmMessage: 'Вы уверены, что хотите удалить данную валюту из отслеживаемых?'
    )
])]
class TrackedCurrency implements WithDisableInterface
{
    use EntityDisableTrait;

    public const ROLE_CREATE = 'TrackedCurrency.create';
    public const ROLE_VIEW = 'TrackedCurrency.view';
    public const ROLE_LIST = 'TrackedCurrency.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\Column]
    #[EntityTableColumn]
    #[Title('Код валюты')]
    #[Groups([self::ROLE_CREATE, self::ROLE_LIST, self::ROLE_VIEW])]
    public CurrencyCodeEnum $currencyCode;

    #[ORM\Column]
    #[Title('Последнее обновление')]
    #[Groups([self::ROLE_LIST, self::ROLE_VIEW])]
    public DateTimeImmutable $latestUpdate;

    /** @var Collection<int, CurrencyPair> */
    #[ORM\OneToMany(mappedBy: 'sellCurrency', targetEntity: CurrencyPair::class)]
    public Collection $sellCurrencyPairs;

    /** @var Collection<int, CurrencyPair> */
    #[ORM\OneToMany(mappedBy: 'buyCurrency', targetEntity: CurrencyPair::class)]
    public Collection $buyCurrencyPairs;

    public function __construct()
    {
        $this->sellCurrencyPairs = new ArrayCollection();
        $this->buyCurrencyPairs = new ArrayCollection();
    }
}
