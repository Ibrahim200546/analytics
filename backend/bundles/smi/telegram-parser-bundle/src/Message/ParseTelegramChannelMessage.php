<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Message;

class ParseTelegramChannelMessage
{
    public function __construct(
        public int $telegramChannelId,
        public int $limit,
        public int $offset,
    ) {
    }
}
