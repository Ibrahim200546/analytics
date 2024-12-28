<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\EventListener;

use Dexodus\FileBundle\Entity\FileHistory;
use Dexodus\FileBundle\Event\FileSignedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: FileSignedEvent::NAME)]
final class CreateFileHistoryForSigningListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(FileSignedEvent $event)
    {
        $file = $event->getFile();

        $fileHistory = new FileHistory();
        $fileHistory->action = 'sign';
        $fileHistory->initiator = $event->getSigner();
        $fileHistory->file = $file;
        $fileHistory->data = ['originalPath' => $file->path, 'ncaPath' => $file->ncaPath];

        $this->entityManager->persist($fileHistory);
        $this->entityManager->flush();
    }
}
