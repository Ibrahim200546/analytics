<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle;

use Dexodus\TypescriptTypesBundle\DependencyInjection\Compiler\LoaderCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class TypescriptTypesBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        $container->addCompilerPass(new LoaderCompilerPass());
    }
}
