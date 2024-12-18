<?php

declare(strict_types=1);

namespace Dexodus\DqlFunctionsBundle\Dql;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class CastToInt extends FunctionNode
{
    private $expr1;

    public function getSql(SqlWalker $sqlWalker)
    {
        return sprintf(
            "CAST((%s) AS INTEGER)",
            $this->expr1->dispatch($sqlWalker)
        );
    }

    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->expr1 = $parser->StringPrimary();
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
}
