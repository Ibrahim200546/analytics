<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('user_session_history');

        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('userEntity')
                    ->defaultValue('App\Entity\User')
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
