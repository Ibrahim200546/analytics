<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\Service;

use Dexodus\SmiParserInterface\Entity\Article;
use Exception;

class GlobalSmiParser
{
    /** @var SmiParserInterface[] */
    private array $parsers = [];

    public function addSmiParser(SmiParserInterface $parser): void
    {
        $this->parsers[$parser->getParserName()] = $parser;
    }

    /**
     * @throws Exception
     */
    public function parseArticle(Article $article): void
    {
        if (!array_key_exists($article->parser, $this->parsers)) {
            throw new Exception("Smi parser '$article->parser' not founded");
        }

        $this->parsers[$article->parser]->parse($article);
    }
}
