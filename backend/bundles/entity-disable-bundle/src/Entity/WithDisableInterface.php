<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\Entity;

interface WithDisableInterface
{
    public function disable(): void;
    public function enable(): void;
    public function isDisabled(): bool;
}
