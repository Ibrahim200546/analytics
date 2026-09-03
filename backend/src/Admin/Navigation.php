<?php

declare(strict_types=1);

namespace App\Admin;

use App\Entity\User;
use App\Entity\Organization;
use App\Enum\Entity\UserRoleEnum;
use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Attribute\FrontendPage;
use Dexodus\AdminConstructorBundle\Attribute\IsGranted;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\AdminConstructorBundle\Dto\RootNavigationInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Symfony\Component\Security\Core\User\UserInterface;

class Navigation implements NavigationInterface, RootNavigationInterface
{
    #[FrontendPage('organizations/my')]
    #[Title('Моя организация')]
    #[IsGranted([UserRoleEnum::ROLE_SUPERVISOR])]
    public PageInterface $myOrganization;

    #[FrontendPage('news')]
    #[Title('Новости')]
    #[IsGranted([UserRoleEnum::ROLE_SUPERVISOR, UserRoleEnum::ROLE_EMPLOYEE])]
    public PageInterface $news;

    #[FrontendPage('projects')]
    #[Title('Проекты')]
    #[IsGranted([UserRoleEnum::ROLE_EMPLOYEE])]
    public PageInterface $projects;

    #[CrudNavigation(Organization::class, Organization::class)]
    #[Title('Организации')]
    #[IsGranted([UserRoleEnum::ROLE_ADMIN])]
    public NavigationInterface $organizations;

    #[Title('Настройки')]
    #[IsGranted([UserRoleEnum::ROLE_ADMIN])]
    public Settings $settings;

    public function getRedirectAfterLogin(UserInterface $user): ?string
    {
        if ($user instanceof User && $user->hasRole(UserRoleEnum::ROLE_ADMIN->value)) {
            return '/admin/organizations/list';
        }

        if ($user instanceof User && $user->hasRole(UserRoleEnum::ROLE_SUPERVISOR->value)) {
            return '/admin/organizations/my';
        }

        if ($user instanceof User && $user->hasRole(UserRoleEnum::ROLE_EMPLOYEE->value)) {
            return '/admin/news';
        }

        return null;
    }
}
