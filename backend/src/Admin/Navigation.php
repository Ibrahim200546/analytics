<?php

declare(strict_types=1);

namespace App\Admin;

use App\Entity\TrackedCurrency;
use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Attribute\IsGranted;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\RootNavigationInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Symfony\Component\Security\Core\User\UserInterface;

class Navigation implements NavigationInterface, RootNavigationInterface
{

    #[Title('Администраторы')]
    #[CrudNavigation(User::ADMIN_FORM_NAME, User::ADMIN_FORM_NAME)]
    #[IsGranted([UserRoleEnum::ROLE_ADMIN])]
    public NavigationInterface $admins;

    #[Title('Валюты')]
    #[CrudNavigation(TrackedCurrency::class, TrackedCurrency::class)]
    #[IsGranted([UserRoleEnum::ROLE_ADMIN])]
    public NavigationInterface $trackedCurrencies;

    public function getRedirectAfterLogin(UserInterface $user): ?string
    {
        if (in_array(UserRoleEnum::ROLE_ADMIN->value, $user->getRoles())) {
            return '/admin/trackedCurrencies/list';
        }

        return null;
    }
}
