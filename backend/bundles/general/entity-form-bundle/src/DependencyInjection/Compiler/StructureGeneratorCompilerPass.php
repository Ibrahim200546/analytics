<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection\Compiler;

use Dexodus\EntityFormBundle\Service\EntityFormStructureGeneratorInterface;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

class StructureGeneratorCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $loaderClass = $container->getParameter('entity-form.structure_generator_class');

        if (!$container->hasDefinition($loaderClass)) {
            $container->setDefinition($loaderClass, new Definition($loaderClass));
        }

        $container->setAlias(EntityFormStructureGeneratorInterface::class, $loaderClass);
    }
}
