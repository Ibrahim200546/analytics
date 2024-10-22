<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait TimestampTrait
{
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups(['Default', 'timestamp', 'timestamp:createdAt'])]
    private DateTimeImmutable $createdAt;

    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups(['Default', 'timestamp', 'timestamp:editedAt'])]
    private DateTimeImmutable $editedAt;

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getEditedAt(): DateTimeImmutable
    {
        return $this->editedAt;
    }

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->editedAt = new DateTimeImmutable();
    }   
}
