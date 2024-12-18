<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityTableBundle\Dto\EntityTable;
use Dexodus\EntityTableBundle\Exception\NotFoundEntityTableException;

interface EntityTableLoaderInterface
{
    /** @param string[] $entityTables */
    public function setEntityTables(array $entityTables): void;

    /** @throws NotFoundEntityTableException */
    public function get(string $entityTableName): EntityTable;
    public function has(string $entityTableName): bool;

    /** @return EntityTable[] */
    public function getAll(): array;

    public function convertClassToEntityFormName(string $class): string;
}
