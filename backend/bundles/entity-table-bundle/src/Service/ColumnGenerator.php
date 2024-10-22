<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\AdminConstructorBundle\Attribute\IsGranted;
use Dexodus\EntityFormBundle\Attribute\FieldAttributeInterface;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Exception\MoreThenOneAttributeException;
use Dexodus\EntityTableBundle\Attribute\ColumnAttributeInterface;
use Dexodus\EntityTableBundle\Attribute\EntityTableColumn as EntityTableColumnAttribute;
use Dexodus\EntityTableBundle\Dto\EntityTableColumn;
use Dexodus\TextCaseBundle\Enum\TextCaseEnum;
use Dexodus\TextCaseBundle\Service\WordsExtractor\WordsExtractor;
use Dexodus\TitleBundle\Service\TitleExtractor;
use Exception;
use ReflectionClass;
use ReflectionMethod;
use ReflectionProperty;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PropertyInfo\PropertyAccessExtractorInterface;
use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class ColumnGenerator
{
    public function __construct(
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
        private PropertyAccessExtractorInterface $propertyAccessExtractor,
        private WordsExtractor $wordsExtractor,
        private DataGenerator $dataGenerator,
        private TitleExtractor $titleExtractor,
        private Security $security,
    ) {
    }

    public function generate(string $objectClass, ?array $options = []): array
    {
        $reflectionClass = new ReflectionClass($objectClass);
        $propertyNames = [];

        foreach ($reflectionClass->getProperties() as $reflectionProperty) {
            $propertyNames[] = $reflectionProperty->getName();
        }

        $properties = $this->propertyInfoExtractor->getProperties($objectClass) ?? [];
        $columns = [];

        foreach ($properties as $property) {
//            if (!in_array($property, $propertyNames)) {
//                continue;
//            }

            try {
                $reflectionProperty = new ReflectionProperty($objectClass, $property);
            } catch (Exception) {
                $reflectionProperty = new ReflectionMethod($objectClass, 'get' . ucfirst($property));
            }

            $attributes = $reflectionProperty->getAttributes();
            /** @var FieldAttributeInterface[] $attributeInstances */
            $attributeInstances = [];

            foreach ($attributes as $attribute) {
                $attributeInstance = $attribute->newInstance();

                if (!$attributeInstance instanceof ColumnAttributeInterface) {
                    continue;
                }

                if (array_key_exists($attribute->getName(), $attributeInstances)) {
                    throw new MoreThenOneAttributeException($objectClass, $property, $attribute->getName());
                }

                $attributeInstances[$attribute->getName()] = $attributeInstance;
            }

            $entityTableColumnAttributes = $reflectionProperty->getAttributes(EntityTableColumnAttribute::class);

            if (!$this->propertyAccessExtractor->isReadable($objectClass, $property)) {
                continue;
            }

            if (count($entityTableColumnAttributes) > 1) {
                throw new MoreThenOneAttributeException($objectClass, $property, EntityTableColumnAttribute::class);
            }

            if (count($entityTableColumnAttributes) === 0) {
                continue;
            }

            $isGrantedAttributes = $reflectionProperty->getAttributes(IsGranted::class);

            if (count($isGrantedAttributes) > 1) {
                throw new MoreThenOneAttributeException($objectClass, $property, IsGranted::class);
            }

            if (count($isGrantedAttributes) === 1) {
                /** @var IsGranted $isGrantedAttribute */
                $isGrantedAttribute = $isGrantedAttributes[0]->newInstance();

                if (count($isGrantedAttribute->roles) > 0) {
                    $user = $this->security->getUser();

                    if (is_null($user)) {
                        throw new AccessDeniedException();
                    }

                    $roles = $user->getRoles();
                    $isGrantedRoles = array_map(fn (mixed $role) => is_string($role) ? $role : $role->value, $isGrantedAttribute->roles);

                    if (empty(count(array_intersect($roles, $isGrantedRoles)))) {
                        continue;
                    }
                }
            }

            /** @var EntityTableColumnAttribute $entityTableColumnAttribute */
            $entityTableColumnAttribute = $entityTableColumnAttributes[0]->newInstance();

            if (array_key_exists('export', $entityTableColumnAttribute->options) && $entityTableColumnAttribute->options['export'] === true) {
                if (!array_key_exists('export', $options) || $options['export'] !== true) {
                    continue;
                }
            }

            $columns[] = $this->getColumn($objectClass, $property, $entityTableColumnAttribute);
        }

        usort($columns, function (EntityTableColumn $a, EntityTableColumn $b) {
            if ($a->priority > $b->priority) {
                return -1;
            } elseif ($a->priority < $b->priority) {
                return 1;
            } else {
                return 0;
            }
        });

        return $columns;
    }

    private function getColumn(string $objectClass, string $property, EntityTableColumnAttribute $entityTableColumnAttribute): EntityTableColumn
    {
        try {
            $reflectionProperty = new ReflectionProperty($objectClass, $property);
        } catch (Exception) {
            $reflectionProperty = new ReflectionMethod($objectClass, 'get' . ucfirst($property));
        }
        $priorityAttributes = $reflectionProperty->getAttributes(Priority::class);

        if (count($priorityAttributes) > 1) {
            throw new MoreThenOneAttributeException($objectClass, $property, EntityTableColumnAttribute::class);
        }

        $column = new EntityTableColumn();
        $column->dataKey = $property;
        $column->nameForFilters = $entityTableColumnAttribute->nameForFilters ?? $property;
        $column->priority = 0;
        $column->title = ucwords(implode(' ', $this->wordsExtractor->extract($property, TextCaseEnum::CAMEL_CASE)));

        $titleFromAttribute = $this->titleExtractor->extractTitleFromProperty($objectClass, $property);

        if (!is_null($titleFromAttribute)) {
            $column->title = $titleFromAttribute;
        }

        $action = $entityTableColumnAttribute->getAction();

        if (is_null($action)) {
            $column->getDataAction = $this->dataGenerator->generate($objectClass, $property, $reflectionProperty);
        } else {
            $column->getDataAction = $action;
        }

        if (!empty($priorityAttributes)) {
            /** @var Priority $priorityAttribute */
            $priorityAttribute = $priorityAttributes[0]->newInstance();
            $column->priority = $priorityAttribute->priority;
        }

        return $column;
    }
}
