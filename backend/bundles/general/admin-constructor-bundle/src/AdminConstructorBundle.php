<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle;

use Dexodus\AdminConstructorBundle\DependencyInjection\Compiler\LoadNavigationCompilerPass;
use Dexodus\AdminConstructorBundle\DependencyInjection\Compiler\LoadPageProcessorsCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class AdminConstructorBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        $container->addCompilerPass(new LoadNavigationCompilerPass());
        $container->addCompilerPass(new LoadPageProcessorsCompilerPass());
    }
}
