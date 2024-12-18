<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Exception;

use Exception;

class NotFoundEntityFormException extends Exception
{
    public function __construct(string $entityFormName, array $availableEntityFormNames)
    {
        $availableForms = implode(', ', $availableEntityFormNames);
        $message = "Entity Form with name '$entityFormName' not found. Available entity forms: [$availableForms]";
        parent::__construct($message);
    }
}
