<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection\Compiler;

use Dexodus\BundleConstructor\Compiler\AbstractLoadClassesCompilerPass;
use Dexodus\EntityFormBundle\Attribute\EntityForm;
use Dexodus\EntityFormBundle\Service\EntityFormLoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoaderCompilerPass extends AbstractLoadClassesCompilerPass
{
    public function process(ContainerBuilder $container)
    {
        $repositoryClass = $container->getParameter('entity-form.loader_class');
        $repositoryInterface = EntityFormLoaderInterface::class;
        $mapping = $container->getParameter('entity-form.mapping');
        $this->loadClasses($container, $repositoryClass, $repositoryInterface, $mapping);
    }

    protected function getRequiredAttributeClass(): string
    {
        return EntityForm::class;
    }

    protected function getRepositorySetClassesMethodName(): string
    {
        return 'setEntityForms';
    }
}
