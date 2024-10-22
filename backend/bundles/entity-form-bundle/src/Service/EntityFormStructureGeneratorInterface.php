<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\Dto\EntityFormStructure;

interface EntityFormStructureGeneratorInterface
{
    public function generate(string $entityFormName, string $modeType): EntityFormStructure;
}
