<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\DependencyInjection\Compiler;

use Dexodus\EntityTableBundle\Attribute\DataGenerator as DataGeneratorAttribute;
use Dexodus\EntityTableBundle\Exception\ExpectedOneDataGeneratorAttributeException;
use Dexodus\EntityTableBundle\Service\DataGenerator;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadDataGeneratorsCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $dataGeneratorDefinitions = [];

        foreach ($container->findTaggedServiceIds('entity_table.data_generator') as $definitionClass => $empty) {
            $reflectionClass = new ReflectionClass($definitionClass);
            $dataGeneratorAttributes = $reflectionClass->getAttributes(DataGeneratorAttribute::class);

            if (count($dataGeneratorAttributes) !== 1) {
                throw new ExpectedOneDataGeneratorAttributeException();
            }

            /** @var DataGeneratorAttribute $dataGeneratorAttribute */
            $dataGeneratorAttribute = $dataGeneratorAttributes[0]->newInstance();
            $dataGeneratorDefinitions[] = [
                'priority' => $dataGeneratorAttribute->priority,
                'definition' => $container->getDefinition($definitionClass),
            ];
        }

        usort($dataGeneratorDefinitions, function ($a, $b) {
            if ($a['priority'] > $b['priority']) {
                return 1;
            }

            if ($a['priority'] < $b['priority']) {
                return -1;
            }

            return 0;
        });

        $dataGeneratorDefinitions = array_map(fn ($value) => $value['definition'], $dataGeneratorDefinitions);
        $dataGeneratorDefinition = $container->getDefinition(DataGenerator::class);
        $dataGeneratorDefinition->addMethodCall('setDataGenerators', [$dataGeneratorDefinitions]);
    }
}
