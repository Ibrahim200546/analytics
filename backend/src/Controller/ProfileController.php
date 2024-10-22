<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;

class ProfileController
{
    public function __construct(
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/my-profile')]
    public function getMyInfo(
        #[CurrentUser] User $user,
    ): Response {
        $result = $this->serializer->serialize($user, 'json', [User::GROUP_LIST_ADMIN, User::ID_VIEW]);

        return new Response($result, headers: ['Content-Type' => 'application/json']);
    }
}
