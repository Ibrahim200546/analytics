<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\DependencyInjection\Compiler;

use Dexodus\BundleConstructor\Compiler\AbstractLoadClassesCompilerPass;
use Dexodus\EntityTableBundle\Attribute\EntityTable;
use Dexodus\EntityTableBundle\Service\EntityTableLoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoaderCompilerPass extends AbstractLoadClassesCompilerPass
{
    public function process(ContainerBuilder $container)
    {
        $repositoryClass = $container->getParameter('entity-table.loader_class');
        $repositoryInterface = EntityTableLoaderInterface::class;
        $mapping = $container->getParameter('entity-table.mapping');
        $this->loadClasses($container, $repositoryClass, $repositoryInterface, $mapping);
    }

    protected function getRequiredAttributeClass(): string
    {
        return EntityTable::class;
    }

    protected function getRepositorySetClassesMethodName(): string
    {
        return 'setEntityTables';
    }
}
