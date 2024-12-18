<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\EventListener;

use Dexodus\EntityHistoryBundle\Entity\EntityHistory;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class DynamicTargetEntityEventListener implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%entity_history.user_entity%')]
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

        if ($metadata->name === EntityHistory::class) {
            $metadata->associationMappings['user']['targetEntity'] = $this->userEntity;
        }
    }
}
