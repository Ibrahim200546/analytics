<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Enum;

enum ChatGPTModelEnum: string
{
    case GPT_4O_MINI = 'gpt-4o-mini';
    case GPT_4O = 'gpt-4o';
}
