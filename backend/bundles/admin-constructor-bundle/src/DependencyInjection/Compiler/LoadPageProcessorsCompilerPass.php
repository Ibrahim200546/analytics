<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\DependencyInjection\Compiler;

use Dexodus\AdminConstructorBundle\Attribute\PageProcessor;
use Dexodus\AdminConstructorBundle\Service\NavigationManager;
use Exception;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadPageProcessorsCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $serviceIds = $container->findTaggedServiceIds('admin_constructor.page_processor');
        $pageProcessorDefinitions = [];

        foreach ($serviceIds as $pageProcessorClass => $serviceId) {
            $definition = $container->getDefinition($pageProcessorClass);

            $pageProcessorReflection = new ReflectionClass($definition->getClass());
            $pageProcessorAttributes = $pageProcessorReflection->getAttributes(PageProcessor::class);

            if (count($pageProcessorAttributes) !== 1) {
                $pageProcessorAttributeClass = PageProcessor::class;

                throw new Exception(
                    "Expected only one attribute '$pageProcessorAttributeClass' for class '{$definition->getClass()}'",
                );
            }

            /** @var PageProcessor $pageProcessorAttribute */
            $pageProcessorAttribute = $pageProcessorAttributes[0]->newInstance();
            $pageProcessorDefinitions[$pageProcessorAttribute->pageClass] = $definition;
        }

        $navigationManagerDefinition = $container->getDefinition(NavigationManager::class);
        $navigationManagerDefinition->addMethodCall('setPageProcessors', [$pageProcessorDefinitions]);
    }
}
