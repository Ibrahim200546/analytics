<?php

declare(strict_types=1);

namespace Dexodus\SmiParserInterface;

use Dexodus\SmiParserInterface\DependencyInjection\Compiler\LoadSmiParsersCompilerPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class SmiParserInterfaceBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        $container->addCompilerPass(new LoadSmiParsersCompilerPass());
    }
}
