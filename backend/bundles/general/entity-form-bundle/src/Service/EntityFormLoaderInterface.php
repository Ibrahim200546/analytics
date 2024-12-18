<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\EntityForm;

interface EntityFormLoaderInterface
{
    /** @param string[] $entityForms */
    public function setEntityForms(array $entityForms): void;

    public function get(string $entityFormName): EntityForm;
    public function has(string $entityFormName): bool;

    /** @return EntityForm[] */
    public function getAll(): array;

    public function convertClassToEntityFormName(string $class): string;
}
