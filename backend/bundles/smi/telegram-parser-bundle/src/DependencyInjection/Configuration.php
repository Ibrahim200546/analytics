<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\DependencyInjection;

use Dexodus\EntityFormBundle\Service\EntityFormLoader;
use Dexodus\EntityFormBundle\Service\EntityFormStructureGenerator;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('telegram_parser');

        // @formatter:off
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('api_id')
                    ->isRequired()
                ->end()
                ->scalarNode('api_hash')
                    ->isRequired()
                ->end()
            ->end()
        ;
        // @formatter:on

        return $treeBuilder;
    }
}
