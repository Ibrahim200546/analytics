<?php

declare(strict_types=1);

namespace App\Admin;

use App\Entity\Organization;
use App\Enum\Entity\UserRoleEnum;
use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Attribute\FrontendPage;
use Dexodus\AdminConstructorBundle\Attribute\IsGranted;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\TitleBundle\Attribute\Title;

class Navigation implements NavigationInterface
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
}
