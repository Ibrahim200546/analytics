<?php

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use ApiPlatform\Exception\ResourceClassNotFoundException;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\PathsGenerator;
use Exception;
use Symfony\Component\PropertyInfo\Type;

#[Priority(1)]
class AsyncEnumCollectionFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private readonly ResourceMetadataCollectionFactoryInterface $resourceMetadataCollectionFactory,
        private readonly PathsGenerator $pathsGenerator,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->isCollection() &&
            !is_null($propertyAttribute) &&
            $propertyAttribute->type === EntityFormFieldTypeEnum::ASYNC_ENUM_COLLECTION &&
            $this->isResource($type->getCollectionValueTypes()[0]->getClassName());
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::ASYNC_ENUM_COLLECTION;
        $field->component = EntityFormFieldComponentEnum::ASYNC_MULTIPLE_DROPDOWN_FIELD;
        $class = $type->getCollectionValueTypes()[0]->getClassName();

        $paths = $this->pathsGenerator->generateForResource($class, ['collection']);

        if (empty($paths)) {
            throw new Exception("Can't find collection paths for resource '$class'");
        }

        if (!is_null($entityFormField) && !is_null($entityFormField->componentArguments)) {
            $field->componentArguments = [
                'url' => $entityFormField->componentArguments['url'] ?? $paths['collection'],
            ];

            if (isset($entityFormField->componentArguments['label'])) {
                $field->componentArguments['label'] = $entityFormField->componentArguments['label'];
            }

            if (isset($entityFormField->componentArguments['search'])) {
                $field->componentArguments['search'] = $entityFormField->componentArguments['search'];
            }
        }

        return $field;
    }

    private function isResource(string $class): bool
    {
        try {
            $this->resourceMetadataCollectionFactory->create($class);
        } catch (ResourceClassNotFoundException) {
            return false;
        }

        return true;
    }
}
