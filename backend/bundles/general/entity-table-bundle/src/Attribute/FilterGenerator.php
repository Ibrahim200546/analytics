<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Attribute;

use Attribute;
use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;

#[Attribute]
class FilterGenerator
{
    public function __construct(
        public readonly string $filterClass,
    ) {
    }
}
