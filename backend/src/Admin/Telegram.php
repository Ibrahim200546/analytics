<?php

declare(strict_types=1);

namespace App\Admin;

use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Attribute\FrontendPage;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\TelegramParserBundle\Entity\TelegramChannel;
use Dexodus\TitleBundle\Attribute\Title;

class Telegram implements NavigationInterface
{
    #[Title('Аккаунты')]
    public TelegramAccounts $accounts;

    #[CrudNavigation(TelegramChannel::class, TelegramChannel::class)]
    #[Title('Телеграмм каналы')]
    public NavigationInterface $channels;
}
