<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField as EntityFormFieldDto;

#[Attribute(Attribute::TARGET_PROPERTY)]
class Section extends AbstractFieldAttribute
{
    public function __construct(
        public readonly string $key,
        public readonly array $groups = [],
    ) {
    }

    public function onAfterCreateField(EntityFormFieldDto $field, array $groups): EntityFormFieldDto
    {
        if (empty($this->groups) || !empty(array_intersect($groups, $this->groups))) {
            $field->sectionGroupKey = $this->key;
        }

        return $field;
    }
}
