<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class TranslationApiExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');

        $mappingItem = [
            'dir' => dirname(__DIR__) . '/Entity',
            'prefix' => 'Dexodus\TranslationApiBundle\Entity',
        ];

        $this->addElementInParameter($container, 'entity-form.mapping', $mappingItem);
        $this->addElementInParameter($container, 'entity-table.mapping', $mappingItem);
    }

    private function addElementInParameter(ContainerBuilder $container, string $parameter, mixed $element): void
    {
        $entityTableMapping = $container->hasParameter($parameter)
            ? $container->getParameter($parameter)
            : [];
        $entityTableMapping[] = $element;
        $container->setParameter($parameter, $entityTableMapping);
    }
}
