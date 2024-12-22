<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Dto;

readonly class ArticleCommentsStructure
{
    public function __construct(
        public string $commentsContainerCssPath = '',
        public string $commentContainerCssPath = '',
        public string $commentatorNameCssPath = '',
        public string $commentContentCssPath = '',
        public string $likesCssPath = '',
        public string $dislikesCssPath = '',
        public string $createdAtCssPath = '',
    ) {
    }
}
