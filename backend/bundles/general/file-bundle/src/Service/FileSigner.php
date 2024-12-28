<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Service;

use Dexodus\FileBundle\Entity\File;
use Dexodus\FileBundle\Event\FileSignedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

readonly class FileSigner
{
    public function __construct(
        #[Autowire('%file.paths.public_dir%')]
        private string $publicPath,
        private FileSecurity $fileSecurity,
        private Security $security,
        private EntityManagerInterface $entityManager,
        private EventDispatcherInterface $eventDispatcher,
    ) {
    }

    public function sign(File $file, string $content): void
    {
        $user = $this->security->getUser();

        if (!$user instanceof UserInterface || !$this->fileSecurity->canSign($file, $user)) {
            throw new AccessDeniedException();
        }

        $file->ncaPath =  $file->path . '.signed';
        $this->entityManager->beginTransaction();

        try {
            file_put_contents($this->publicPath . '/' . $file->ncaPath, $content);

            $event = new FileSignedEvent($file, $user, $content);
            $this->eventDispatcher->dispatch($event, FileSignedEvent::NAME);

            $this->entityManager->flush();
            $this->entityManager->commit();
        } catch (Exception $exception) {
            $this->entityManager->rollback();
            throw $exception;
        }
    }
}
