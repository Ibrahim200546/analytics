<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Jsel;

interface JselActionInterface
{
    public function generateAction(): string;
}
