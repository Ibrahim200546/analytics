<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use ApiPlatform\Metadata\ApiFilter;
use Dexodus\EntityTableBundle\Dto\EntityTableStructure;
use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;
use Dexodus\EntityTableBundle\Exception\NotFoundFilterTypeException;
use Dexodus\EntityTableBundle\Service\Filter\FilterGeneratorInterface;
use ReflectionClass;

class EntityFilterExtractor
{
    private array $filterGenerators = [];

    public function setFilterGenerators(array $filterGenerators): void
    {
        $this->filterGenerators = $filterGenerators;
    }

    public function fillFiltersInStructure(EntityTableStructure $entityTableStructure): void
    {
        $reflectionClass = new ReflectionClass($entityTableStructure->entity);
        $attributes = $reflectionClass->getAttributes(ApiFilter::class);

        foreach ($attributes as $attribute) {
            /** @var ApiFilter $attributeInstance */
            $attributeInstance = $attribute->newInstance();

            try {
                $filterType = FilterTypeEnum::mapFilter($attributeInstance->filterClass);
            } catch (NotFoundFilterTypeException) {
                continue;
            }

            $filterGenerator = $this->getFilterGenerator($attributeInstance->filterClass);

            if (is_null($filterGenerator)) {
                continue;
            }

            foreach ($entityTableStructure->columns as $column) {
                if (!empty($attributeInstance->properties)) {
                    $skip = true;

                    foreach ($attributeInstance->properties as $index => $property) {
                        if (!is_int($index)) {
                            $property = $index;
                        }

                        if ($property === $column->nameForFilters) {
                            $skip = false;
                        }
                    }

                    if ($skip) {
                        continue;
                    }
                }

                $filter = $filterGenerator->generate($entityTableStructure->entity, $column->dataKey, $column->nameForFilters);
                if (is_null($filter->type)) {
                    $filter->type = $filterType;
                }
                $column->filters[] = $filter;
            }
        }
    }

    private function getFilterGenerator(string $filterClass): ?FilterGeneratorInterface
    {
         if (array_key_exists($filterClass, $this->filterGenerators)) {
             return $this->filterGenerators[$filterClass];
         }

         return null;
    }
}
