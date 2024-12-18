<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $builder = new TreeBuilder('admin_constructor');

        // @formatter:off
        $builder->getRootNode()
            ->children()
                ->scalarNode('navigation_class')
                    ->isRequired()
                ->end()
            ->end();
        // @formatter:on

        return $builder;
    }
}
