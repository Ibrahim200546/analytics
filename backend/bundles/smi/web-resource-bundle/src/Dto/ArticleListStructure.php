<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Dto;

readonly class ArticleListStructure
{
    public function __construct(
        public string $containerCssPath,
        public string $articleLinkCssPath,
        public string $articlesPathPattern,
    ) {
    }
}
