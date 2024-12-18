<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

class SearchCustomFieldFilter extends AbstractFilter
{
    private function joinPart(QueryBuilder $queryBuilder, string $value): string
    {
        $propertyPaths = explode('.', $value);
        $endPart = array_pop($propertyPaths);
        $aliases = $queryBuilder->getAllAliases();
        $lastPath = $aliases[0];

        foreach ($propertyPaths as $path) {
            if (!in_array($path, $aliases)) {
                $queryBuilder->join(sprintf('%s.%s', $lastPath, $path), $path);
            }
            $lastPath = $path;
        }

        $lastPath .= '.';

        if (count($propertyPaths) === 0) {
            $lastPath = '';
        }

        return $lastPath . $endPart;
    }

    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {
        if (isset($this->properties[$property])) {
            $parts = explode('+', $this->properties[$property]);
            $mappedParts = [];

            foreach ($parts as $part) {
                $mappedParts[] = trim($part);
            }

            $result = $this->joinPart($queryBuilder, array_pop($mappedParts));

            foreach (array_reverse($mappedParts) as $part) {
                $result = 'CONCAT(' . $this->joinPart($queryBuilder, $part) . ', ' . $result . ')';
            }

            $parameterName = $queryNameGenerator->generateParameterName($property);
            $queryBuilder
                ->andWhere(sprintf("lower(%s) LIKE lower(:%s)", $result, $parameterName))
                ->setParameter($parameterName, '%' . $value . '%')
            ;
        }
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];

        foreach ($this->properties as $property => $strategy) {
            $description["custom_search_$property"] = [
                'property' => $property,
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Custom Search filter',
                    'name' => 'Custom Search filter',
                    'type' => 'search',
                ],
            ];
        }

        return $description;
    }
}
