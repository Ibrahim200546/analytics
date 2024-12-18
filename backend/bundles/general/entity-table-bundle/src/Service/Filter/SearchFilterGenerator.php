<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\Filter;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Dexodus\EntityFormBundle\Service\PathsGenerator;
use Dexodus\EntityTableBundle\Attribute\FilterGenerator;
use Dexodus\EntityTableBundle\Dto\Filter;
use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;
use Dexodus\TitleBundle\Service\TitleExtractor;
use ReflectionEnum;
use ReflectionEnumBackedCase;
use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;

#[FilterGenerator(SearchFilter::class)]
class SearchFilterGenerator implements FilterGeneratorInterface
{
    public function __construct(
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
        private PathsGenerator $pathsGenerator,
        private TitleExtractor $titleExtractor,
    ) {
    }

    public function generate(string $class, string $property, string $filterName): Filter
    {
        $filter = new Filter();

        $filter->type = FilterTypeEnum::TYPE_SEARCH;
        $filter->query = "{$filterName}[]={data0}";

        $types = $this->propertyInfoExtractor->getTypes($class, $property);
        $type = $types[0];

        if (!is_null($type->getClassName())) {
            if (enum_exists($type->getClassName())) {
                $reflectionEnum = new ReflectionEnum($type->getClassName());

                $filter->options = [
                    "options" => array_map(function (ReflectionEnumBackedCase $case) use ($type) {
                        $title = $this->titleExtractor->extractTitleFromEnumCase($type->getClassName(), $case->getName()) ?? $case->getName();

                        return [
                            'label' => $title,
                            'value' => $case->getBackingValue(),
                        ];
                    }, $reflectionEnum->getCases()),
                ];
                $filter->type = FilterTypeEnum::TYPE_ENUM_SEARCH;
            }
        }

        if ($type->getBuiltinType() === 'object') {
            $paths = $this->pathsGenerator->generateForResource($type->getClassName(), ['collection']);

            if (!empty($paths)) {
                $filter->options = [
                    'url' => $paths['collection'],
                ];
                $filter->type = FilterTypeEnum::TYPE_ASYNC_SEARCH;
            }
        }

        return $filter;
    }
}
