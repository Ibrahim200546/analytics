<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Service;

use Dexodus\FileBundle\Entity\File;
use League\Flysystem\FilesystemOperator;

class FileWriter
{
    public function __construct(
        private FilesystemOperator $defaultStorage,
    ) {
    }

    public function uploadFileInStorage(File $file, string $content): void
    {
        $this->defaultStorage->write($file->path, $content);
    }
}
