<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Exception;

use Exception;

class TypeNotSupportedException extends Exception
{
    public function __construct(mixed $value)
    {
        $type = gettype($value);
        parent::__construct("Type '$type' not supported");
    }
}
