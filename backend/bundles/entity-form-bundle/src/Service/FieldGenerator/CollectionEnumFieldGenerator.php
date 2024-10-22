<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\ChoicesEnumExtractor;
use Symfony\Component\PropertyInfo\Type;

#[Priority(10)]
class CollectionEnumFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private ChoicesEnumExtractor $choicesEnumExtractor,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->isCollection() &&
            !is_null($type->getCollectionValueTypes()[0]->getClassName()) &&
            enum_exists($type->getCollectionValueTypes()[0]->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::ENUM_COLLECTION;
        $field->component = EntityFormFieldComponentEnum::MULTIPLE_DROPDOWN_FIELD;
        $choices = $this->choicesEnumExtractor->extract($type->getCollectionValueTypes()[0]->getClassName());
        $field->componentArguments = ['options' => $choices];

        return $field;
    }
}
