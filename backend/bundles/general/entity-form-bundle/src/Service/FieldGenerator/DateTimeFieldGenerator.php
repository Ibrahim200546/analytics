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

#[Priority(1)]
class DateTimeFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->getClassName() === DateTime::class || $type->getClassName() === DateTimeImmutable::class;
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::DATETIME;
        $field->component = EntityFormFieldComponentEnum::DATETIME_PICKER_FIELD;

        $format = 'YYYY-MM-DD HH:mm:ss';

        if (!is_null($entityFormField) &&
            !is_null($entityFormField->componentArguments) &&
            isset($entityFormField->componentArguments['format'])
        ) {
            $format = $entityFormField->componentArguments['format'];
        }

        $field->componentArguments = [
            'format' => $format,
        ];

        return $field;
    }
}
