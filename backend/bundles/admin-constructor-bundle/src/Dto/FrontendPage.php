<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Dto;

readonly class FrontendPage implements PageInterface
{
    public function __construct(
        private string $component,
    ) {
    }

    public function getType(): string
    {
        return $this->component;
    }
}
