<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Dto;

class EntityTablePage implements PageInterface
{
    public function __construct(
        public string $name,
    ) {
    }

    public function getType(): string
    {
        return 'EntityTable';
    }
}
