<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
class Validator
{
    public function __construct(
        public string $constraintClass,
    ) {
    }
}
