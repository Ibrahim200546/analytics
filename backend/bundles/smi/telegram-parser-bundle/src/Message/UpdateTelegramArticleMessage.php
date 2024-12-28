<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Message;

class UpdateTelegramArticleMessage
{
    public function __construct(
        public int $articleId,
    ) {
    }
}
