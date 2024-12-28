<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Service;

use DateInterval;
use DateTime;
use Dexodus\FileBundle\Entity\File;
use League\Flysystem\FilesystemOperator;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class FileReader
{
    private bool $ranLocally;

    public function __construct(
        #[Autowire('%file.paths.public_dir%')]
        private string             $publicPath,

        private FilesystemOperator $defaultStorage,

        #[Autowire('%file.ran_locally%')]
        ?bool                      $ranLocally,
    ) {
        $this->ranLocally = $ranLocally ?? false;
    }

    public function getBase64(File $file): string
    {
        return base64_encode($this->getContent($file));
    }

    public function getContent(File $file): string
    {
//        $user = $this->security->getUser();
//
//        if (!$user instanceof User || !$this->fileSecurity->canRead($file, $user)) {
//            throw new AccessDeniedException();
//        }

        return $this->defaultStorage->read($file->path);
    }

    public function saveFileTemporaryOnMachine(File $file): string
    {
        $fileContent = $this->getContent($file);
        $filename = sha1(microtime()) . '.' . $file->extension;
        $filepath = $this->publicPath . '/' . $filename;

        file_put_contents($filepath, $fileContent);

        return $filepath;
    }

    public function getTemporaryUrl(File $file): string
    {
        // TODO : Add security
//        $user = $this->security->getUser();
//
//        if (!$user instanceof User || !$this->fileSecurity->canRead($file, $user)) {
//            throw new AccessDeniedException();
//        }
        $afterFiveMinutesTime = (new DateTime())->add(DateInterval::createFromDateString('5 minutes'));
        $url = $this->defaultStorage->temporaryUrl($file->path, $afterFiveMinutesTime);

        if ($this->ranLocally) {
            $url = str_replace('http://localstack', 'http://localhost', $url);
        }

        return $url;
    }
}
