<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Exception;

use Exception;

class NotFoundEntityTableException extends Exception
{
    public function __construct(string $entityTableName, array $availableEntityTableNames)
    {
        $availableTables = implode(', ', $availableEntityTableNames);
        $message = "Entity Table with name '$entityTableName' not found. Available entity tables: [$availableTables]";
        parent::__construct($message);
    }
}
