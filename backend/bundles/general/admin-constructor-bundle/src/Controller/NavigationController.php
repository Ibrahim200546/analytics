<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Controller;

use Dexodus\AdminConstructorBundle\Service\NavigationManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

readonly class NavigationController
{
    public function __construct(
        private SerializerInterface $serializer,
        private NavigationManager $navigationManager,
    ) {
    }

    #[Route('/admin-constructor/navigation', name: 'admin_constructor.navigation')]
    public function getNavigation(): Response
    {
        $navigation = $this->navigationManager->getNavigation();
        $json = $this->serializer->serialize($navigation, 'json');

        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }
}
