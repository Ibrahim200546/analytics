<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('chatgpt');

        // @formatter:off
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('api_key')
                    ->isRequired()
                ->end()
            ->end()
        ;
        // @formatter:on

        return $treeBuilder;
    }
}
