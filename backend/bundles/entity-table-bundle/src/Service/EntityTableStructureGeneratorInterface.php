<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityTableBundle\Dto\EntityTableStructure;

interface EntityTableStructureGeneratorInterface
{
    public function generate(string $entityTableName): EntityTableStructure;
}
