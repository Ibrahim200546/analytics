<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\FieldAttributeInterface;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Exception\MoreThenOneAttributeException;
use Dexodus\EntityFormBundle\Service\FieldGenerator\FieldGeneratorInterface;
use Dexodus\TextCaseBundle\Enum\TextCaseEnum;
use Dexodus\TextCaseBundle\Service\WordsExtractor\WordsExtractor;
use Dexodus\TitleBundle\Service\TitleExtractor;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\PropertyAccessExtractorInterface;
use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class FieldsGenerator
{
    /** @var FieldGeneratorInterface[] */
    private array $fieldGenerators;

    public function __construct(
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
        private PropertyAccessExtractorInterface $propertyAccessExtractor,
        private ValidatorExtractor $validatorExtractor,
        private PathConstructor $pathConstructor,
        private WordsExtractor $wordsExtractor,
        private TitleExtractor $titleExtractor,
    ) {
    }

    public function setFieldGenerators(array $fieldGenerators): void
    {
        $this->fieldGenerators = $fieldGenerators;
    }

    public function generate(string $objectClass, string $context = '', array $groups = ['Default']): array
    {
        $reflectionClass = new ReflectionClass($objectClass);
        $propertyNames = [];

        foreach ($reflectionClass->getProperties() as $reflectionProperty) {
            $propertyNames[] = $reflectionProperty->getName();
        }

        $properties = $this->propertyInfoExtractor->getProperties($objectClass) ?? [];
        $fields = [];

        foreach ($properties as $property) {
            if (!in_array($property, $propertyNames)) {
                continue;
            }

            $reflectionProperty = new ReflectionProperty($objectClass, $property);
            $attributes = $reflectionProperty->getAttributes();
            /** @var FieldAttributeInterface[] $attributeInstances */
            $attributeInstances = [];

            foreach ($attributes as $attribute) {
                $attributeInstance = $attribute->newInstance();

                if (!$attributeInstance instanceof FieldAttributeInterface) {
                    continue;
                }

                if (array_key_exists($attribute->getName(), $attributeInstances)) {
                    throw new MoreThenOneAttributeException($objectClass, $property, $attribute->getName());
                }

                $attributeInstances[$attribute->getName()] = $attributeInstance;
            }

            $propertyAttributes = $reflectionProperty->getAttributes(EntityFormFieldAttribute::class);
            $groupsAttributes = $reflectionProperty->getAttributes(Groups::class);

            if (!$this->propertyAccessExtractor->isWritable($objectClass, $property)) {
                continue;
            }

            if (count($propertyAttributes) > 1) {
                throw new MoreThenOneAttributeException($objectClass, $property, EntityFormFieldAttribute::class);
            }

            if (count($groupsAttributes) > 1) {
                throw new MoreThenOneAttributeException($objectClass, $property, Groups::class);
            }

            /** @var Groups|null $groupAttribute */
            $groupAttribute = isset($groupsAttributes[0]) ? $groupsAttributes[0]->newInstance() : null;

            if (empty(array_intersect($groups, $groupAttribute?->getGroups() ?? [])) && !(in_array(
                        'Default',
                        $groups,
                    ) && is_null($groupAttribute))) {
                continue;
            }

            /** @var EntityFormFieldAttribute|null $propertyAttribute */
            $propertyAttribute = isset($propertyAttributes[0]) ? $propertyAttributes[0]->newInstance() : null;

            $skipCreatingField = false;

            foreach ($attributeInstances as $attributeInstance) {
                $skipCreatingField = $attributeInstance->onBeforeCreateField(
                    $objectClass,
                    $property,
                    $context,
                    $propertyAttribute,
                    $groups,
                );

                if ($skipCreatingField) {
                    break;
                }
            }

            if ($skipCreatingField) {
                continue;
            }

            $field = $this->getField($objectClass, $property, $context, $propertyAttribute, $groups);

            foreach ($attributeInstances as $attributeInstance) {
                $field = $attributeInstance->onAfterCreateField($field, $groups);
            }

            $title = $this->titleExtractor->extractTitleFromProperty($objectClass, $property);

            if (!is_null($title)) {
                $field->title = $title;
            }

            $fields[] = $field;
        }

        usort($fields, function (EntityFormField $a, EntityFormField $b) {
            if ($a->priority > $b->priority) {
                return -1;
            } elseif ($a->priority < $b->priority) {
                return 1;
            } else {
                return 0;
            }
        });

        return $fields;
    }

    private function getField(
        string $objectClass,
        string $property,
        string $context,
        ?EntityFormFieldAttribute $propertyAttribute,
        array $groups = [],
    ): EntityFormField {
        $propertyPath = $this->pathConstructor->getPath($objectClass, $property, $context);

        $field = new EntityFormField();
        $field->path = $property;
        $type = $this->propertyInfoExtractor->getTypes($objectClass, $property)[0];
        $field->type = EntityFormFieldTypeEnum::mapBuiltinType($type->getBuiltinType());
        $field->title = ucwords(implode(' ', $this->wordsExtractor->extract($property, TextCaseEnum::CAMEL_CASE)));
        $field->priority = 0;
        $field->sectionGroupKey = $property;

        if (!is_null($propertyAttribute)) {
            $field->type = $propertyAttribute->type ?? $field->type;
            $field->title = $propertyAttribute->title ?? $field->title;

            if (!is_null($propertyAttribute->defaultValue)) {
                $field->defaultValue = $propertyAttribute->defaultValue;
            }
        }

        $validators = $this->validatorExtractor->extractForProperty($objectClass, $property, $propertyPath, $groups);

        if (!is_null($propertyAttribute) && !is_null($propertyAttribute->events)) {
            $field->events = $propertyAttribute->events;
        }

        if (!empty($validators)) {
            $field->validators = $validators;
        }

        $generatorIsFounded = false;

        foreach ($this->fieldGenerators as $fieldGenerator) {
            if ($fieldGenerator->isSupport($propertyAttribute, $type)) {
                $field = $fieldGenerator->generate($field, $propertyAttribute, $type, $propertyPath, $groups);
                $generatorIsFounded = true;
                break;
            }
        }

        if (!$generatorIsFounded) {
            $field->component = EntityFormFieldComponentEnum::getDefaultFieldByType($field->type);
        }

        return $field;
    }
}
