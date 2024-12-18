<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
class DataGenerator
{
    public function __construct(
        public int $priority = 0,
    ) {
    }
}
