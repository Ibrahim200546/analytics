<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
readonly class PageProcessor
{
    public function __construct(
        public string $pageClass,
    ) {
    }
}
