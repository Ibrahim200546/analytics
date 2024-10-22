<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn;
use Dexodus\TitleBundle\Attribute\Title;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait IdTrait
{
    public const ID_VIEW = 'id.view';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups([self::ID_VIEW])]
    #[EntityTableColumn]
    #[Title('ID')]
    #[Priority(100)]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
