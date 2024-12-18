<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Dto\EntityFormEvent;
use Dexodus\EntityFormBundle\Dto\EntityFormMode;

#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
class EntityForm
{
    /**
     * @param string|null $name
     * @param string|null $entity
     * @param string[] $methods
     * @param EntityFormMode[] $modes
     * @param array|null $paths
     * @param EntityFormEvent[] $events
     */
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $entity = null,
        public readonly array $methods = ['get', 'collection', 'create', 'edit'],
        public readonly array $modes = [new EntityFormMode('create'), new EntityFormMode('edit'), new EntityFormMode('view')],
        public readonly ?array $paths = null,
        public readonly array $events = [],
    ) {
    }
}
