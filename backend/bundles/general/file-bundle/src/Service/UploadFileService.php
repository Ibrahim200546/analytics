<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Service;

use Dexodus\FileBundle\Exception\FileExistsException;
use Dexodus\FileBundle\Entity\File;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class UploadFileService
{
    public function __construct(
        private FilesystemOperator     $defaultStorage,
        private EntityManagerInterface $em,
        #[Autowire('%file.paths.save_documents_relative_path%')]
        private string                 $saveDocumentsRelativePath,
    ) {
    }

    public function saveContent(string $content, string $fileName, string $namespace = 'unsorted')
    {
        $directory = $namespace;
        $filePath = $directory . '/' . $fileName;

        if (!$this->defaultStorage->directoryExists($directory)) {
            $this->defaultStorage->createDirectory($directory);
        }

        if ($this->defaultStorage->fileExists($filePath)) {
            throw new FileExistsException();
        }

        $this->defaultStorage->write($filePath, $content);

        return $filePath;
    }

    public function saveFile(string $content, string $fileName, string $namespace = 'unsorted', bool $flush = true): File
    {
        $filePath = $this->saveContent($content, $fileName, $namespace);

        return $this->saveToDB([
            'path' => $filePath,
            'name' => $fileName,
            'originalName' => $fileName,
        ], $flush);
    }

    public function uploadFile(UploadedFile $requestFile): File
    {
        $fileInfos = $this->saveToDirectory($requestFile);

        return $this->saveToDB($fileInfos);
    }

    public function saveToDirectory(UploadedFile $requestFile): array
    {
        $fileName = $this->getSaveFilenameByUploadedFile($requestFile);
        $filePath = $this->saveDocumentsRelativePath . '/' . $fileName;

        $this->defaultStorage->write($filePath, $requestFile->getContent());

        return ['name' => $fileName, 'path' => $filePath, 'originalName' => $requestFile->getClientOriginalName()];
    }

    public function saveCopyOfFile(File $file): array
    {
        $fileName = $this->getSaveFilename($file->extension);
        $relativeFilePath = $this->saveDocumentsRelativePath . '/' . $fileName;

        $this->defaultStorage->copy($file->path, $relativeFilePath);

        return ['name' => $fileName, 'path' => $relativeFilePath];
    }

    public function saveToDB(array $fileInfo, bool $flush = true): File
    {
        $file = new File();
        $file->name = $fileInfo['name'];
        $file->path = $fileInfo['path'];
        $file->originalName = $fileInfo['originalName'];

        $tmpFilename = '/tmp/' . $this->getSaveFilename('.tmp');
        file_put_contents($tmpFilename, $this->defaultStorage->read($fileInfo['path']));

        $extension = pathinfo($tmpFilename, PATHINFO_EXTENSION);

        if ($extension === 'tmp') {
            $pathParts = explode('.', $file->name);
            $extension = $pathParts[count($pathParts) - 1];
        }

        $file->extension = $extension;
        $file->mimeType = mime_content_type($tmpFilename);
        $file->savedAt = new DateTime();
        $file->isTemp = true;

        unset($tmpFilename);

        $this->em->persist($file);
        if ($flush) {
            $this->em->flush();
        }

        return $file;
    }

    public function copy(File $file): File
    {
        $fileInfo = $this->saveCopyOfFile($file);

        return $this->saveToDB($fileInfo);
    }

    private function getSaveFilename(string $extension): string
    {
        return sha1(microtime()) . '.' . $extension;
    }

    private function getSaveFilenameByUploadedFile(UploadedFile $file): string
    {
        return $this->getSaveFilename($file->guessExtension() ?? $file->getExtension());
    }
}
