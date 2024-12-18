<?php

declare(strict_types=1);

namespace Dexodus\EntityExportBundle\Service\Exporter;

use DateTime;
use Dexodus\EntityTableBundle\Dto\EntityTableStructure;
use Dexodus\Jsel\Jsel;
use Dexodus\Jsel\JselContext;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class XlsxExporter implements ExporterInterface
{
    public function export(EntityTableStructure $entityTableStructure, array $entities = []): string
    {
        $spreadSheet = new Spreadsheet();
        $worksheet = $spreadSheet->getActiveSheet();

        $i = 1;

        foreach ($entityTableStructure->columns as $column) {
            $stringColumn = Coordinate::stringFromColumnIndex($i);

            $worksheet->setCellValue([$i, 1], $column->title);
            $worksheet->getColumnDimension($stringColumn)->setAutoSize(true);
            $worksheet->getStyle([$i, 1])->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_MEDIUM);
            $worksheet->getStyle([$i, 1])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $worksheet->getStyle([$i, 1])->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
            $worksheet->getStyle([$i, 1])->getFont()->setBold(true);
            $worksheet->getRowDimension(1)->setRowHeight(30);
            $i++;
        }

        $y = 2;

        foreach ($entities as $entity) {
            $jsel = new Jsel(new JselContext(['entity' => $entity]));

            $i = 1;

            foreach ($entityTableStructure->columns as $column) {
                $worksheet->setCellValue([$i, $y], $jsel->exec($column->getDataAction));
                $worksheet->getStyle([$i, $y])->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
                $worksheet->getStyle([$i, $y])->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
                $worksheet->getStyle([$i, $y])->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

                $i++;
            }

            $worksheet->getRowDimension($y)->setRowHeight(30);

            $y++;
        }

        $writer = new Xlsx($spreadSheet);

        $currentTime = (new DateTime())->format('Y-m-d_H:i:s');
        $exportedFilePath = "/tmp/exported_{$entityTableStructure->name}_$currentTime.xlsx";
        $writer->save($exportedFilePath);

        return $exportedFilePath;
    }
}
