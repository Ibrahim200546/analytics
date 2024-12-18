<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Dto;

class TypescriptType
{
    public string $name;
    public string $fullName;
    public string $originalClass;
    public ?string $calculatedCode = null;

    /**
     * @var string[]
     */
    public array $groups = [];
}
