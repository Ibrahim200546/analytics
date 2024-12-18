<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField as EntityFormFieldDto;

interface FieldAttributeInterface
{
    /**
     * @return bool If need skip creating this field, return true
     */
    public function onBeforeCreateField(
        string                    $objectClass,
        string                    $property,
        string                    $context,
        ?EntityFormFieldAttribute $propertyAttribute,
        array                     $groups,
    ): bool;

    public function onAfterCreateField(EntityFormFieldDto $field, array $groups): EntityFormFieldDto;
}
