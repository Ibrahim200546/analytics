<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\ButtonField;
use Dexodus\EntityFormBundle\Dto\CheckboxField;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Symfony\Component\PropertyInfo\Type;

#[Priority(1)]
class CheckboxFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->getClassName() === CheckboxField::class;
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::BOOLEAN;
        $field->component = EntityFormFieldComponentEnum::CHECKBOX_FIELD;

        return $field;
    }
}
