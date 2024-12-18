<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface\DependencyInjection;

use Dexodus\SmiParserInterface\Service\SmiParserInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class SmiParserInterfaceExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $container->registerForAutoconfiguration(SmiParserInterface::class)
            ->addTag('smi_parser.parser')
        ;

        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');
    }
}
