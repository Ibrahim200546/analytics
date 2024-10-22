<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Dto;

use Dexodus\EntityTableBundle\Enum\FilterTypeEnum;

class Filter
{
    public ?FilterTypeEnum $type = null;

    public string $query;

    public ?array $options;
}
