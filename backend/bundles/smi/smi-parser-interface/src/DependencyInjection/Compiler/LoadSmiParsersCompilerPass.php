<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\DependencyInjection\Compiler;

use Dexodus\SmiParserInterface\Service\GlobalSmiParser;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadSmiParsersCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $globalSmiParserDefinition = $container->getDefinition(GlobalSmiParser::class);
        $taggedServices = $container->findTaggedServiceIds('smi_parser.parser');

        foreach ($taggedServices as $serviceId => $tags) {
            $smiParserDefinition = $container->getDefinition($serviceId);
            $globalSmiParserDefinition->addMethodCall('addSmiParser', [$smiParserDefinition]);
        }
    }
}
