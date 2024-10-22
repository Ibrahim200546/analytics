<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Dto;

class EntityTableStructure
{
    public string $name;

    /** @var EntityTableColumn[] */
    public array $columns;
    public string $entity;
    public string $path;
    public array $actions;
}
