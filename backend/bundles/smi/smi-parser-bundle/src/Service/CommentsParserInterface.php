<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Service;

use Dexodus\SmiParserBundle\Entity\Article;

interface CommentsParserInterface
{
    public function parseComments(Article $article): void;

    public function canParse(string $parser, string $source, string $originalPath): bool;
}
