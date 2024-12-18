<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Message;

class WebResourceRawArticle
{
    public function __construct(
        public readonly int $webResourceId,
        public readonly string $articleUrl,
    ) {
    }
}
