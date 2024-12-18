<?php

declare(strict_types=1);

namespace App\Enum\Entity;

use Dexodus\TitleBundle\Attribute\Title;

enum SubscriptionTypeEnum: string
{
    #[Title('Основная подписка')]
    case GENERAL = 'general';

    #[Title('Демо подписка')]
    case DEMO = 'demo';
}
