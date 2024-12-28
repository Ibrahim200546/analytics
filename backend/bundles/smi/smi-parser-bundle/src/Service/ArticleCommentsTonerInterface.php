<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Service;

use Dexodus\SmiParserBundle\Entity\Article;

interface ArticleCommentsTonerInterface
{
    public function tone(Article $article): void;
}
