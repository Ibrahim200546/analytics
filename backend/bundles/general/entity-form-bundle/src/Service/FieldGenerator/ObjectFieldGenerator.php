<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\FieldsGenerator;
use Symfony\Component\PropertyInfo\Type;

class ObjectFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private FieldsGenerator $fieldsGenerator,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->getBuiltinType() === 'object' && !enum_exists($type->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::OBJECT;
        $field->component = EntityFormFieldComponentEnum::OBJECT_FIELD;
        $field->fields = $this->fieldsGenerator->generate($type->getClassName(), $propertyPath, $groups);

        return $field;
    }
}
