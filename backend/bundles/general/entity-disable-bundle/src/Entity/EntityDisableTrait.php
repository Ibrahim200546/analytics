<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

trait EntityDisableTrait
{
    #[ORM\Column(options: ['default' => false])]
    private bool $disabled = false;

    public function disable(): void
    {
        $this->disabled = true;
    }

    public function enable(): void
    {
        $this->disabled = false;
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }
}
