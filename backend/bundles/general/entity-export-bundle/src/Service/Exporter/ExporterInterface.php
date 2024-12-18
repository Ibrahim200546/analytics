<?php

declare(strict_types=1);

namespace Dexodus\EntityExportBundle\Service\Exporter;

use Dexodus\EntityTableBundle\Dto\EntityTableStructure;

interface ExporterInterface
{
    public function export(EntityTableStructure $entityTableStructure, array $entities = []): string;
}
