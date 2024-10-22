<?php

declare(strict_types=1);

namespace Dexodus\TitleBundle\Attribute;

use Attribute;

#[Attribute]
class Title
{
    public function __construct(
        public readonly string $value,
    ) {
    }
}
