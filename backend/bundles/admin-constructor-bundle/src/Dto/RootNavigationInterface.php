<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Dto;

use Symfony\Component\Security\Core\User\UserInterface;

interface RootNavigationInterface
{
    public function getRedirectAfterLogin(UserInterface $user): ?string;
}
