<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\Filter;

use Dexodus\EntityTableBundle\Attribute\FilterGenerator;
use Dexodus\EntityTableBundle\Dto\Filter;
use Dexodus\EntityTableBundle\Filter\SearchCustomFieldFilter;

#[FilterGenerator(SearchCustomFieldFilter::class)]
class SearchCustomFieldFilterGenerator implements FilterGeneratorInterface
{
    public function generate(string $class, string $property, string $filterName): Filter
    {
        $filter = new Filter();
        $filter->query = "{$filterName}={data0}";

        return $filter;
    }
}
