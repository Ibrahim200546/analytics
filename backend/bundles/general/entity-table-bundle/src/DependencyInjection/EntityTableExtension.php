<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class EntityTableExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');

        $config = $this->processConfiguration(new Configuration(), $configs);

        $container->setParameter('entity-table.loader_class', $config['loader']);
        $container->setParameter('entity-table.structure_generator_class', $config['structure_generator']);

        if ($container->hasParameter('entity-table.mapping')) {
            $mapping = $container->getParameter('entity-table.mapping');
        } else {
            $mapping = [];
        }

        $container->setParameter('entity-table.mapping', array_merge($config['mapping'], $mapping));
    }
}
