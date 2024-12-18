<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Service;

use Dexodus\TypescriptTypesBundle\Dto\TypescriptType;

interface TypescriptTypesLoaderInterface
{
    /** @param string[] $typescriptTypes */
    public function setTypescriptTypes(array $typescriptTypes): void;

    public function get(string $typescriptTypeName): TypescriptType;
    public function has(string $typescriptTypeName): bool;

    /** @return TypescriptType[] */
    public function getAll(): array;

    /** @return TypescriptType[] */
    public function getTypescriptTypesForClass(string $class): array;
}
