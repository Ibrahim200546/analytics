<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Enum;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Dexodus\EntityTableBundle\Exception\NotFoundFilterTypeException;
use Dexodus\EntityTableBundle\Filter\SearchCustomFieldFilter;

enum FilterTypeEnum: string
{
    case TYPE_ENUM_SEARCH = 'enum_search';
    case TYPE_ASYNC_SEARCH = 'async_search';
    case TYPE_SEARCH = 'search';
    case TYPE_SORT = 'sort';
    case TYPE_DATE = 'date';

    public static function mapFilter(string $filterClass): FilterTypeEnum
    {
        switch ($filterClass) {
            case SearchFilter::class:
            case SearchCustomFieldFilter::class:
                return self::TYPE_SEARCH;
            case OrderFilter::class:
                return self::TYPE_SORT;
            case DateFilter::class:
                return self::TYPE_DATE;
        }

        throw new NotFoundFilterTypeException();
    }
}
