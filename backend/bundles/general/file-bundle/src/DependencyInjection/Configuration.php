<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('file');

        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('userEntity')
                    ->isRequired()
                ->end()
                ->scalarNode('save_documents_path')
                    ->defaultValue('uploads')
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
