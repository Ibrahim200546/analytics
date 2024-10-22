<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use DateTime;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\UserSessionHistoryBundle\State\MySessionsProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(provider: MySessionsProvider::class),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['userId' => 'exact'])]
#[EntityTable]
class UserSession
{
    public const USER_IP_ADDRESS_UNDEFINED = 'undefined';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['id.view'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    public UserInterface $user;

    #[ORM\Column]
    #[EntityTableColumn]
    public DateTime $loginDate;

    #[ORM\Column]
    #[EntityTableColumn]
    public string $ipAddress;

    public function getId(): ?int
    {
        return $this->id;
    }
}
