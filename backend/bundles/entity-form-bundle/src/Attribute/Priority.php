<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField as EntityFormFieldDto;

#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_PROPERTY)]
class Priority extends AbstractFieldAttribute
{
    public function __construct(
        public int $priority = 0,
    ) {
    }

    public function onAfterCreateField(EntityFormFieldDto $field, array $groups): EntityFormFieldDto
    {
        $field->priority = $this->priority;

        return $field;
    }
}
