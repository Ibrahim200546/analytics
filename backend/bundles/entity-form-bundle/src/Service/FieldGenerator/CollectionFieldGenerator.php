<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\FieldsGenerator;
use Symfony\Component\PropertyInfo\Type;

class CollectionFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private FieldsGenerator $fieldsGenerator,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->isCollection() &&
            !is_null($type->getCollectionValueTypes()[0]->getClassName()) &&
            !enum_exists($type->getCollectionValueTypes()[0]->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::COLLECTION;
        $field->component = EntityFormFieldComponentEnum::COLLECTION_FIELD;
        $collectionValueType = $type->getCollectionValueTypes()[0]->getClassName();
        $field->fields = $this->fieldsGenerator->generate($collectionValueType, $propertyPath, $groups);

        return $field;
    }
}
