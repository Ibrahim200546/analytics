<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Dexodus\EntityFormBundle\Dto\EntityFormField as EntityFormFieldDto;

abstract class AbstractFieldAttribute implements FieldAttributeInterface
{
    public function onBeforeCreateField(string $objectClass, string $property, string $context, ?EntityFormField $propertyAttribute, array $groups): bool
    {
        return false;
    }

    public function onAfterCreateField(EntityFormFieldDto $field, array $groups): EntityFormFieldDto
    {
        return $field;
    }
}
