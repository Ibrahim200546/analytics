<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('smi_parser');

        // @formatter:off
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('article_comments_toner')
                    ->isRequired()
                ->end()
            ->end()
        ;
        // @formatter:on

        return $treeBuilder;
    }
}
