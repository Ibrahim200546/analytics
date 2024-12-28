<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Service;


use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Symfony\Component\Console\Output\ConsoleOutputInterface;

interface SmiParserInterface
{
    public function parseNewArticles(ConsoleOutputInterface $output): void;

    public function parse(Article $article): void;

    public function getParserName(): string;

    public function getSourceFavicon(Article $article): string;

    public function getSourceName(Article $article): string;

    public function getSourceLink(Article $article): string;

    public function replyComment(ArticleComment $articleComment, string $comment, ParserAccountInterface $parserAccount): string | false;
}
