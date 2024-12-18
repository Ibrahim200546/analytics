<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\DependencyInjection\Compiler;

use Dexodus\BundleConstructor\Compiler\AbstractLoadClassesCompilerPass;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Dexodus\TypescriptTypesBundle\Service\TypescriptTypesLoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoaderCompilerPass extends AbstractLoadClassesCompilerPass
{
    public function process(ContainerBuilder $container)
    {
        $repositoryClass = $container->getParameter('typescript-types.loader_class');
        $repositoryInterface = TypescriptTypesLoaderInterface::class;
        $mapping = $container->getParameter('typescript-types.mapping');
        $this->loadClasses($container, $repositoryClass, $repositoryInterface, $mapping);
    }

    protected function getRequiredAttributeClass(): string
    {
        return AsTSType::class;
    }

    protected function getRepositorySetClassesMethodName(): string
    {
        return 'setTypescriptTypes';
    }
}
