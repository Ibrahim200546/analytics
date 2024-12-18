<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Enum;

enum MessageRoleEnum: string
{
    case SYSTEM = 'system';

    case USER = 'user';
    case ASSISTANT = 'assistant';
}
