<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle;

use Dexodus\EntityTableBundle\DependencyInjection\Compiler\FilterGeneratorExtractorCompilerPass;
use Dexodus\EntityTableBundle\DependencyInjection\Compiler\LoadDataGeneratorsCompilerPass;
use Dexodus\EntityTableBundle\DependencyInjection\Compiler\LoaderCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class EntityTableBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new LoaderCompilerPass());
        $container->addCompilerPass(new FilterGeneratorExtractorCompilerPass());
        $container->addCompilerPass(new LoadDataGeneratorsCompilerPass());
    }
}
