<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\EventListener;

use Dexodus\FileBundle\Entity\FileHistory;
use Dexodus\FileBundle\Entity\FileMember;
use Dexodus\UserSessionHistoryBundle\Entity\UserSession;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class DynamicTargetEntitySubscriber implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%file.user_entity%')]
        private string $userEntity,
    ) {
    }

    public function getSubscribedEvents()
    {
        return [Events::loadClassMetadata => 'loadClassMetadata'];
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs): void
    {
        $metadata = $eventArgs->getClassMetadata();

        if ($metadata->name === FileMember::class) {
            $metadata->associationMappings['user']['targetEntity'] = $this->userEntity;
        }

        if ($metadata->name === FileHistory::class) {
            $metadata->associationMappings['initiator']['targetEntity'] = $this->userEntity;
        }
    }
}
