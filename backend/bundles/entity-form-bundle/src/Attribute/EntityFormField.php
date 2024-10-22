<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Dto\EntityFormFieldEvent;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;

#[Attribute(Attribute::TARGET_PROPERTY)]
class EntityFormField
{
    public function __construct(
        public readonly ?EntityFormFieldTypeEnum $type = null,
        public readonly ?EntityFormFieldComponentEnum $component = null,
        public readonly ?array $componentArguments = null,

        /** @var EntityFormFieldEvent[]|null */
        public readonly ?array $events = null,
        public readonly mixed $defaultValue = null,
    ) {
    }
}
