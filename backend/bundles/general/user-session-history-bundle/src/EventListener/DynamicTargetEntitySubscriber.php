<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\EventListener;

use Dexodus\UserSessionHistoryBundle\Entity\UserSession;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class DynamicTargetEntitySubscriber implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%user_session_history.user_entity%')]
        private string $userEntity,
    )
    {
    }

    public function getSubscribedEvents()
    {
        return [Events::loadClassMetadata => 'loadClassMetadata'];
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs): void
    {
        $metadata = $eventArgs->getClassMetadata();

        if ($metadata->name === UserSession::class) {
            $metadata->associationMappings['user']['targetEntity'] = $this->userEntity;
        }
    }
}
