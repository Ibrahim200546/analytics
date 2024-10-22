<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_METHOD)]
class IsGranted
{
    public function __construct(
        public readonly array $roles = [],
    ) {
    }
}
