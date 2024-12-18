<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\DependencyInjection;

use Dexodus\EntityTableBundle\Service\EntityTableLoader;
use Dexodus\EntityTableBundle\Service\EntityTableStructureGenerator;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('entity_table');

        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('loader')
                    ->defaultValue(EntityTableLoader::class)
                ->end()
                ->scalarNode('structure_generator')
                    ->defaultValue(EntityTableStructureGenerator::class)
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

        return $treeBuilder;
    }
}
