<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Dto;

readonly class ArticleStructure
{
    public function __construct(
        public string $titleCssPath,
        public string $imageCssPath,
        public string $announceCssPath,
        public string $contentCssPath,
        public string $createdAtCssPath,
        public string $createdAtFormat,
    ) {
    }
}
