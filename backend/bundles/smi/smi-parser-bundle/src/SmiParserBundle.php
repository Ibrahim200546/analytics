<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle;

use Dexodus\SmiParserBundle\DependencyInjection\Compiler\LoadArticleCommentsTonersCompilerPass;
use Dexodus\SmiParserBundle\DependencyInjection\Compiler\LoadCommentsParsersCompilerPass;
use Dexodus\SmiParserBundle\DependencyInjection\Compiler\LoadSmiParsersCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class SmiParserBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        $container->addCompilerPass(new LoadSmiParsersCompilerPass());
        $container->addCompilerPass(new LoadCommentsParsersCompilerPass());
        $container->addCompilerPass(new LoadArticleCommentsTonersCompilerPass());
    }
}
