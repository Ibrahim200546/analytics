<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\OrganizationAccountRepository;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrganizationAccountRepository::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ['organization' => 'exact', 'parserName' => 'exact'])]
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
#[EntityTable]
#[AsTSType(groups: [self::ROLE_VIEW])]
class OrganizationAccount implements ParserAccountInterface
{
    public const ROLE_CREATE = 'OrganizationAccount.create';
    public const ROLE_EDIT = 'OrganizationAccount.edit';
    public const ROLE_VIEW = 'OrganizationAccount.view';
    public const ROLE_LIST = 'OrganizationAccount.list';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[EntityTableColumn]
    #[Groups([self::ROLE_VIEW, self::ROLE_LIST])]
    public readonly int $id;

    #[ORM\ManyToOne(targetEntity: Organization::class, inversedBy: 'accounts')]
    #[Groups([self::ROLE_VIEW, self::ROLE_CREATE])]
    public Organization $organization;

    #[Title('Дата добавления')]
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups([self::ROLE_LIST])]
    public DateTimeImmutable $createdAt;

    #[Title('Тип аккаунта')]
    #[ORM\Column]
    #[Groups([self::ROLE_CREATE, self::ROLE_LIST])]
    #[EntityTableColumn]
    public string $parserName;

    #[Title('Имя аккаунта')]
    #[ORM\Column]
    #[Groups([self::ROLE_CREATE, self::ROLE_LIST])]
    #[EntityTableColumn]
    public string $accountName;

    #[ORM\Column(type: 'json')]
    #[Groups([self::ROLE_CREATE])]
    public array $options = [];

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getParserName(): string
    {
        return $this->parserName;
    }

    public function getAccountOptions(): array
    {
        return $this->options;
    }

    public function getAccountName(): string
    {
        return $this->accountName;
    }

    public function getAccountId(): int
    {
        return $this->id;
    }
}
