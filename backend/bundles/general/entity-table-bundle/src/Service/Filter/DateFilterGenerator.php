<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\Filter;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use Dexodus\EntityTableBundle\Attribute\FilterGenerator;
use Dexodus\EntityTableBundle\Dto\Filter;
use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;

#[FilterGenerator(DateFilter::class)]
class DateFilterGenerator implements FilterGeneratorInterface
{
    public function generate(string $class, string $property, string $filterName): Filter
    {
        $filter = new Filter();
        $filter->query = "{$filterName}[after]={data0}&{$filterName}[before]={data1}";
        $filter->type = FilterTypeEnum::TYPE_DATE;

        return $filter;
    }
}
