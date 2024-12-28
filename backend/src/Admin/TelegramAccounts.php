<?php

declare(strict_types=1);

namespace App\Admin;

use Dexodus\AdminConstructorBundle\Attribute\EntityTablePage;
use Dexodus\AdminConstructorBundle\Attribute\FrontendPage;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\TelegramParserBundle\Entity\TelegramAccount;
use Dexodus\TitleBundle\Attribute\Title;

class TelegramAccounts implements NavigationInterface
{
    #[EntityTablePage(TelegramAccount::class)]
    #[Title('Список аккаунтов')]
    public PageInterface $list;

    #[FrontendPage('create')]
    #[Title('Добавить аккаунт')]
    public PageInterface $create;
}
