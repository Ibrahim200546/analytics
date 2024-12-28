<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\DependencyInjection\Compiler;

use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadArticleCommentsTonersCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $globalSmiParserDefinition = $container->getDefinition(GlobalSmiParser::class);
        $taggedServices = $container->findTaggedServiceIds('smi_parser.article_comments_toner');

        foreach ($taggedServices as $serviceId => $tags) {
            $articleCommentsTonerDefinition = $container->getDefinition($serviceId);
            $globalSmiParserDefinition->addMethodCall('addArticleCommentsToner', [$articleCommentsTonerDefinition]);
        }
    }
}
