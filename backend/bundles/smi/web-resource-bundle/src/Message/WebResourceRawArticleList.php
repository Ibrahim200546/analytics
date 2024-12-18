<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Message;

class WebResourceRawArticleList
{
    public function __construct(
        public readonly int $webResourceId,
        public readonly string $listUrl,
    ) {
    }
}
