<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Attribute;

use Attribute;
use Dexodus\EntityTableBundle\Action\ActionInterface;

#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
class EntityTable
{
    /**
     * @param ActionInterface[] $actions
     */
    public function __construct(
        public readonly ?string $name = null,
        public readonly array $actions = [],
        public readonly ?string $path = null,
    ) {
    }
}
