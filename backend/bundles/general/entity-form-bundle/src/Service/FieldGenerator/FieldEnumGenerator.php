<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\ChoicesEnumExtractor;
use Symfony\Component\PropertyInfo\Type;

class FieldEnumGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private ChoicesEnumExtractor $choicesEnumExtractor,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->getBuiltinType() === 'object' && enum_exists($type->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::ENUM;
        $field->component = EntityFormFieldComponentEnum::DROPDOWN_FIELD;
        $field->componentArguments = ['options' => $this->choicesEnumExtractor->extract($type->getClassName())];

        return $field;
    }
}
