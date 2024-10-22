<?php

declare(strict_types=1);

namespace Dexodus\DqlFunctionsBundle\Dql;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class JsonContains extends FunctionNode
{
    private $jsonExpression;
    private $stringExpression;

    public function getSql(SqlWalker $sqlWalker)
    {
        return sprintf(
            "%s::jsonb @> CONCAT('[\"', %s::text, '\"]')::jsonb",
            $this->jsonExpression->dispatch($sqlWalker),
            $this->stringExpression->dispatch($sqlWalker),
        );
    }

    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->jsonExpression = $parser->StringPrimary();
        $parser->match(Lexer::T_COMMA);
        $this->stringExpression = $parser->StringPrimary();
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
}
