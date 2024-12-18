<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Exception;

use Exception;

class NotFoundTypescriptTypeException extends Exception
{
    public function __construct(string $typescriptTypeName, array $availableTypescriptTypeNames)
    {
        $available = implode(', ', $availableTypescriptTypeNames);
        $message = "Typescript type with name '$typescriptTypeName' not found. Available entity forms: [$available]";
        parent::__construct($message);
    }
}
