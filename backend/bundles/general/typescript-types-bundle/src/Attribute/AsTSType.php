<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
class AsTSType
{
    public function __construct(
        public readonly ?string $namespace = null,
        public readonly ?string $name = null,
        public readonly array $groups = [],
    ) {
    }
}
