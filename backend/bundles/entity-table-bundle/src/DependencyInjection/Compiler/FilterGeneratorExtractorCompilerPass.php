<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\DependencyInjection\Compiler;

use Dexodus\EntityTableBundle\Attribute\FilterGenerator;
use Dexodus\EntityTableBundle\Service\EntityFilterExtractor;
use Exception;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class FilterGeneratorExtractorCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $filterGenerators = [];

        foreach ($container->findTaggedServiceIds('entity_table.filter_generator') as $filterGeneratorClass => $empty) {
            $reflectionClass = new ReflectionClass($filterGeneratorClass);
            $attributes = $reflectionClass->getAttributes(FilterGenerator::class);

            if (count($attributes) > 1) {
                throw new Exception(
                    "For class '" . $filterGeneratorClass . "' more than one attribute '" .
                    FilterGenerator::class . "' is used"
                );
            }

            if (count($attributes) === 1) {
                /** @var FilterGenerator $attribute */
                $attribute = $attributes[0]->newInstance();
                $filterGenerators[$attribute->filterClass] = $container->getDefinition($filterGeneratorClass);
            }
        }

        $validatorExtractorDefinition = $container->getDefinition(EntityFilterExtractor::class);
        $validatorExtractorDefinition->addMethodCall('setFilterGenerators', [$filterGenerators]);
    }
}
