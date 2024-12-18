<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Symfony\Component\PropertyInfo\Type;

class ScalarCollectionFieldGenerator implements FieldGeneratorInterface
{
    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->isCollection() && is_null($type->getCollectionValueTypes()[0]->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::SCALAR_COLLECTION;
        $field->component = EntityFormFieldComponentEnum::SCALAR_COLLECTION_FIELD;
        $field->componentArguments['itemType'] = EntityFormFieldTypeEnum::mapBuiltinType(
            $type->getCollectionValueTypes()[0]->getBuiltinType(),
        );
        $field->componentArguments['itemComponent'] = EntityFormFieldComponentEnum::getDefaultFieldByType(
            $field->componentArguments['itemType']
        );

        return $field;
    }
}
