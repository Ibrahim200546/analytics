<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Symfony\Component\PropertyInfo\Type;

#[Priority(100)]
class PhoneFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $propertyAttribute !== null && $propertyAttribute->component === EntityFormFieldComponentEnum::PHONE_FIELD;
    }

    public function generate(EntityFormField $field, ?EntityFormFieldAttribute $entityFormField, Type $type, string $propertyPath, array $groups,): EntityFormField
    {
        $field->component = EntityFormFieldComponentEnum::PHONE_FIELD;

        return $field;
    }
}
