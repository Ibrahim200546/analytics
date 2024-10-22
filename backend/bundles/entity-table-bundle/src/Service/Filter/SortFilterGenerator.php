<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\Filter;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Dexodus\EntityTableBundle\Attribute\FilterGenerator;
use Dexodus\EntityTableBundle\Dto\Filter;
use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;

#[FilterGenerator(OrderFilter::class)]
class SortFilterGenerator implements FilterGeneratorInterface
{
    public function generate(string $class, string $property, string $filterName): Filter
    {
        $filter = new Filter();
        $filter->type = FilterTypeEnum::TYPE_SORT;
        $filter->query = "order[$filterName]=";

        return $filter;
    }
}
