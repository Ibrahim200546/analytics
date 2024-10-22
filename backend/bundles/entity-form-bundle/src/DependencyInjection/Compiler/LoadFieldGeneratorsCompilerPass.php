<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection\Compiler;

use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Exception\MoreThenOneAttributeException;
use Dexodus\EntityFormBundle\Service\FieldsGenerator;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadFieldGeneratorsCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $fieldGeneratorClasses = $container->findTaggedServiceIds('entity_form.field_generator');
        $fieldGenerators = [];

        foreach ($fieldGeneratorClasses as $fieldGeneratorClass => $none) {
            $reflectionClass = new ReflectionClass($fieldGeneratorClass);
            $priorityAttributes = $reflectionClass->getAttributes(Priority::class);

            if (count($priorityAttributes) > 1) {
                throw new MoreThenOneAttributeException($fieldGeneratorClass, null, Priority::class);
            }

            $fieldGenerators[] = [
                'fieldGenerator' => $container->getDefinition($fieldGeneratorClass),
                'priority' => empty($priorityAttributes) ? 0 : $priorityAttributes[0]->newInstance()->priority,
            ];
        }

        usort($fieldGenerators, function ($a, $b) {
            if ($a['priority'] > $b['priority']) {
                return -1;
            } elseif ($a['priority'] < $b['priority']) {
                return 1;
            } else {
                return 0;
            }
        });

        $fieldsGeneratorDefinition = $container->getDefinition(FieldsGenerator::class);
        $fieldsGeneratorDefinition->addMethodCall('setFieldGenerators', [
            array_map(fn($object) => $object['fieldGenerator'], $fieldGenerators),
        ]);
    }
}
