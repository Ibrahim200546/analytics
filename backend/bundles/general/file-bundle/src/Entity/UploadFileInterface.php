<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Entity;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UploadFileInterface
{
    public function saveToDirectory(UploadedFile $requestFile);

    public function saveToDB(File $file);
}
