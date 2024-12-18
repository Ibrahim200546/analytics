<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

class EntityFormMode
{
    public function __construct(
        public string $type,
        public array $groups = ['Default'],
    ) {
    }
}
