<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Exception\ForbiddenException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Config\Definition\Exception\ForbiddenOverwriteException;

readonly class MeUserProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if ($user instanceof User) {
            return $user;
        }

        throw new ForbiddenException();
    }
}
