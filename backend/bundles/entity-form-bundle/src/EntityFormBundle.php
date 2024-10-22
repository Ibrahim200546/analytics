<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle;

use Dexodus\EntityFormBundle\DependencyInjection\Compiler\LoaderCompilerPass;
use Dexodus\EntityFormBundle\DependencyInjection\Compiler\LoadFieldGeneratorsCompilerPass;
use Dexodus\EntityFormBundle\DependencyInjection\Compiler\StructureGeneratorCompilerPass;
use Dexodus\EntityFormBundle\DependencyInjection\Compiler\ValidatorExtractorCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class EntityFormBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new LoaderCompilerPass());
        $container->addCompilerPass(new ValidatorExtractorCompilerPass());
        $container->addCompilerPass(new LoadFieldGeneratorsCompilerPass());
        $container->addCompilerPass(new StructureGeneratorCompilerPass());
    }
}
