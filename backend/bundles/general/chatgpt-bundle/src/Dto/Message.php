<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Dexodus\ChatGPTBundle\Enum\MessageRoleEnum;

readonly class Message
{
    public function __construct(
        public MessageRoleEnum $role,
        public string $content,
        public mixed $refusal = null,
    ) {
    }
}
