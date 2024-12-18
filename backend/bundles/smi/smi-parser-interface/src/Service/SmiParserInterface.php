<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\Service;


use Dexodus\SmiParserInterface\Entity\Article;

interface SmiParserInterface
{
    public function parse(Article $article): void;

    public function getParserName(): string;
}
