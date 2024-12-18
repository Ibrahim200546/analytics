<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
readonly class FrontendPage implements PageAttributeInterface
{
    public function __construct(
        public string $component,
    ) {
    }
}
