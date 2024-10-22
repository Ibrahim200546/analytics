<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Dto;

class EntityFormPage implements PageInterface
{
    public function __construct(
        public string $name,
        public string $mode,
    ) {
    }

    public function getType(): string
    {
        return 'EntityForm';
    }
}
