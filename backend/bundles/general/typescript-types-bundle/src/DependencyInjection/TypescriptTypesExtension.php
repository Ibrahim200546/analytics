<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class TypescriptTypesExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');

        $config = $this->processConfiguration(new Configuration(), $configs);

        $container->setParameter('typescript-types.loader_class', $config['loader']);

        if ($container->hasParameter('typescript-types.mapping')) {
            $mapping = $container->getParameter('typescript-types.mapping');
        } else {
            $mapping = [];
        }

        $container->setParameter('typescript-types.mapping', array_merge($config['mapping'], $mapping));
    }
}
