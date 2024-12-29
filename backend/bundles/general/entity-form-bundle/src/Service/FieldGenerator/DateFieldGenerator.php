<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use DateTime;
use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Symfony\Component\PropertyInfo\Type;

#[Priority(2)]
class DateFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $propertyAttribute && $propertyAttribute->type === EntityFormFieldTypeEnum::DATE && ($type->getClassName() === DateTime::class || $type->getClassName() === DateTimeImmutable::class);
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::DATE;
        $field->component = EntityFormFieldComponentEnum::DATE_FIELD;

        $format = 'YYYY-MM-DD';

        if (!is_null($entityFormField) &&
            !is_null($entityFormField->componentArguments) &&
            isset($entityFormField->componentArguments['format'])
        ) {
            $format = $entityFormField->componentArguments['format'];
        }

        $field->componentArguments = [
            'format' => $format,
            'defaultValue' => (new DateTimeImmutable())->format('Y-m-d'),
        ];

        return $field;
    }
}
