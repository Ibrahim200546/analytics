<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection;

use Dexodus\EntityFormBundle\Service\EntityFormLoader;
use Dexodus\EntityFormBundle\Service\EntityFormStructureGenerator;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('entity_form');

        // @formatter:off
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('loader')
                    ->defaultValue(EntityFormLoader::class)
                ->end()
                ->scalarNode('structure_generator')
                    ->defaultValue(EntityFormStructureGenerator::class)
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
