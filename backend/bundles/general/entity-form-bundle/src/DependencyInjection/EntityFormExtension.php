<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class EntityFormExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');

        $config = $this->processConfiguration(new Configuration(), $configs);

        $container->setParameter('entity-form.loader_class', $config['loader']);
        $container->setParameter('entity-form.structure_generator_class', $config['structure_generator']);

        if ($container->hasParameter('entity-form.mapping')) {
            $mapping = $container->getParameter('entity-form.mapping');
        } else {
            $mapping = [];
        }

        $container->setParameter('entity-form.mapping', array_merge($config['mapping'], $mapping));
    }
}
