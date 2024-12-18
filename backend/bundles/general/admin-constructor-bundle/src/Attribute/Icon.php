<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
class Icon
{
    public function __construct(
        public readonly string $name,
    ) {
    }
}
