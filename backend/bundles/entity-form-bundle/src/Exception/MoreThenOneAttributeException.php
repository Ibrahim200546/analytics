<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Exception;

use Exception;

class MoreThenOneAttributeException extends Exception
{
    public function __construct(string $class, ?string $property, string $attributeClass)
    {
        if (is_null($property)) {
            $message = "For class '" . $class . "' more than one attribute '$attributeClass' is used";
        } else {
            $message = "For property '$property' in class '" . $class . "' more than one attribute '$attributeClass' is used";
        }


        parent::__construct($message);
    }
}
