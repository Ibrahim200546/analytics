<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Event;

use Dexodus\FileBundle\Entity\File;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\EventDispatcher\Event;

class FileSignedEvent extends Event
{
    public const NAME = 'file.signed';

    public function __construct(
        protected File $file,
        protected UserInterface $signer,
        protected string $content,
    ) {
    }

    public function getFile(): File
    {
        return $this->file;
    }

    public function getSigner(): UserInterface
    {
        return $this->signer;
    }

    public function getContent(): string
    {
        return $this->content;
    }
}
