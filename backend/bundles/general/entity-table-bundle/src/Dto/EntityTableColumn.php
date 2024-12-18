<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Dto;

class EntityTableColumn
{
    public string $title;

    public string $dataKey;
    public string $nameForFilters;

    public int $priority = 0;
    public string $getDataAction;

    /** @var Filter[] */
    public array $filters = [];
}
