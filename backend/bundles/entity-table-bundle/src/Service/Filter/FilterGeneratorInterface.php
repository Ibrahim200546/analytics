<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\Filter;

use Dexodus\EntityTableBundle\Dto\Filter;

interface FilterGeneratorInterface
{
    public function generate(string $class, string $property, string $filterName): Filter;
}
