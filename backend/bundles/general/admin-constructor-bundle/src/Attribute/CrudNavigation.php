<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
readonly class CrudNavigation implements NavigationAttributeInterface
{
    public function __construct(
        public string $entityFormName,
        public string $entityTableName,
    ) {
    }
}
