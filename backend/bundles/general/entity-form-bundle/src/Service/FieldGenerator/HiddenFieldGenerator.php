<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Symfony\Component\PropertyInfo\Type;

#[Priority(100)]
class HiddenFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $propertyAttribute !== null && $propertyAttribute->type === EntityFormFieldTypeEnum::HIDDEN;
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->component = EntityFormFieldComponentEnum::HIDDEN_FIELD;

        return $field;
    }
}
