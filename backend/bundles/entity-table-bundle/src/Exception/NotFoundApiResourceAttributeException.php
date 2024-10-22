<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Exception;

use ApiPlatform\Metadata\ApiResource;
use Exception;

class NotFoundApiResourceAttributeException extends Exception
{
    public function __construct(string $entityClass)
    {
        $apiResourceClass = ApiResource::class;
        parent::__construct("In entity '$entityClass' not founded '$apiResourceClass'.");
    }
}
