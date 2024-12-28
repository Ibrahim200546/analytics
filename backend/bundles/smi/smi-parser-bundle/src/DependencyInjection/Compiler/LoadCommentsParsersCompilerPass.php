<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\DependencyInjection\Compiler;

use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadCommentsParsersCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $globalSmiParserDefinition = $container->getDefinition(GlobalSmiParser::class);
        $taggedServices = $container->findTaggedServiceIds('smi_parser.comments_parser');

        foreach ($taggedServices as $serviceId => $tags) {
            $commentsParserDefinition = $container->getDefinition($serviceId);
            $globalSmiParserDefinition->addMethodCall('addCommentsParser', [$commentsParserDefinition]);
        }
    }
}
