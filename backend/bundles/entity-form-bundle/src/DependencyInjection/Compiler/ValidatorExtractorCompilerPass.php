<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\DependencyInjection\Compiler;

use Dexodus\EntityFormBundle\Attribute\Validator as ValidatorAttribute;
use Dexodus\EntityFormBundle\Service\ValidatorExtractor;
use Exception;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ValidatorExtractorCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $validators = [];

        foreach ($container->findTaggedServiceIds('entity_form.validator') as $validatorClass => $empty) {
            $reflectionClass = new ReflectionClass($validatorClass);
            $attributes = $reflectionClass->getAttributes(ValidatorAttribute::class);

            if (count($attributes) > 1) {
                throw new Exception(
                    "For class '" . $validatorClass . "' more than one attribute '" .
                    ValidatorAttribute::class . "' is used"
                );
            }

            if (count($attributes) === 1) {
                /** @var ValidatorAttribute $attribute */
                $attribute = $attributes[0]->newInstance();
                $validators[$attribute->constraintClass] = $container->getDefinition($validatorClass);
            }
        }

        $validatorExtractorDefinition = $container->getDefinition(ValidatorExtractor::class);
        $validatorExtractorDefinition->addMethodCall('setValidators', [$validators]);
    }
}
