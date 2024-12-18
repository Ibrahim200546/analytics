<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\DependencyInjection;

use Dexodus\EntityFormBundle\Service\EntityFormLoader;
use Dexodus\EntityFormBundle\Service\EntityFormStructureGenerator;
use Dexodus\TypescriptTypesBundle\Service\TypescriptTypesLoader;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('typescript_types');

        // @formatter:off
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('loader')
                    ->defaultValue(TypescriptTypesLoader::class)
                ->end()
                ->arrayNode('mapping')->arrayPrototype()->children()
                    ->scalarNode('dir')
                        ->cannotBeEmpty()
                    ->end()
                    ->scalarNode('prefix')
                        ->cannotBeEmpty()
                    ->end()
                ->end()
            ->end()
        ;
        // @formatter:on

        return $treeBuilder;
    }
}
