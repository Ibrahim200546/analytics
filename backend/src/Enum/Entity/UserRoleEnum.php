<?php

declare(strict_types=1);

namespace App\Enum\Entity;

use Dexodus\TitleBundle\Attribute\Title;

enum UserRoleEnum: string
{
    #[Title('Администратор')]
    case ROLE_ADMIN = 'ROLE_ADMIN';

    #[Title('Пользователь')]
    case ROLE_USER = 'ROLE_USER';
}
