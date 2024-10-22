<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\EventListener;

use DateTime;
use Dexodus\UserSessionHistoryBundle\Entity\UserSession;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Http\SecurityEvents;

class SaveUserLoginSessionSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    )
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            SecurityEvents::INTERACTIVE_LOGIN => 'onSecurityInteractiveLogin',
        ];
    }

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();

        if ($user instanceof UserInterface) {
            $userSession = new UserSession();
            $userSession->user = $user;
            $userSession->loginDate = new DateTime();
            $userSession->ipAddress = $event->getRequest()->getClientIp() ?? UserSession::USER_IP_ADDRESS_UNDEFINED;

            $this->entityManager->persist($userSession);
            $this->entityManager->flush();
        }
    }
}
