<?php

declare(strict_types=1);

namespace Dexodus\EntityExportBundle\Controller;

use Dexodus\EntityExportBundle\Service\Exporter;
use Dexodus\EntityTableBundle\Service\EntityTableStructureGenerator;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

class ExportController
{
    public function __construct(
        private EntityTableStructureGenerator $entityTableStructureGenerator,
        private Exporter $exporter,
    ) {
    }

    #[Route('/entity-table/export/{name}')]
    public function export(string $name, #[MapQueryParameter] ?string $entitiesPath = null): Response
    {
        $structure = $this->entityTableStructureGenerator->generate($name, ['export' => true]);
        $exportedFilepath = $this->exporter->export($structure, $entitiesPath);

        $response = new BinaryFileResponse(
            $exportedFilepath,
            headers: ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        );

        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, "$name.xlsx");

        return $response;
    }
}
