<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Dto;

use Dexodus\EntityTableBundle\Attribute\EntityTable as EntityTableAttribute;

class EntityTable
{
    public string $name;

    public string $entity;

    public object $table;

    public EntityTableAttribute $attribute;
}
