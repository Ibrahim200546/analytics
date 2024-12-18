<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\DependencyInjection\Compiler;

use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation as CrudNavigationAttribute;
use Dexodus\AdminConstructorBundle\Attribute\EntityFormPage as EntityFormPageAttribute;
use Dexodus\AdminConstructorBundle\Attribute\EntityTablePage as EntityTablePageAttribute;
use Dexodus\AdminConstructorBundle\Attribute\FrontendPage as FrontendPageAttribute;
use Dexodus\AdminConstructorBundle\Attribute\NavigationAttributeInterface;
use Dexodus\AdminConstructorBundle\Attribute\PageAttributeInterface;
use Dexodus\AdminConstructorBundle\Dto\CrudNavigation;
use Dexodus\AdminConstructorBundle\Dto\EntityFormPage;
use Dexodus\AdminConstructorBundle\Dto\EntityTablePage;
use Dexodus\AdminConstructorBundle\Dto\FrontendPage;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\AdminConstructorBundle\Service\NavigationManager;
use Exception;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class LoadNavigationCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $navigationClass = $container->getParameter('admin_constructor.navigation_class');

        if (!class_exists($navigationClass)) {
            throw new Exception("Not founded class '$navigationClass'");
        }

        $navigation = $this->processNavigation($navigationClass);
        $navigationManagerDefinition = $container->getDefinition(NavigationManager::class);
        $navigationManagerDefinition->addMethodCall('setNavigation', [serialize($navigation)]);
    }

    private function processNavigation(string $navigationClass): NavigationInterface
    {
        $navigationReflectionClass = new ReflectionClass($navigationClass);
        $reflectionProperties = $navigationReflectionClass->getProperties(ReflectionProperty::IS_PUBLIC);
        $navigation = $navigationReflectionClass->newInstanceWithoutConstructor();

        foreach ($reflectionProperties as $reflectionProperty) {
            $className = $reflectionProperty->getType()->getName();

            if (in_array(NavigationInterface::class, class_implements($className))) {
                $reflectionProperty->setValue($navigation, $this->processNavigation($className));
            }

            if (NavigationInterface::class === $className) {
                $navigationAttribute = $this->getAttributeByInterface(
                    NavigationAttributeInterface::class,
                    $reflectionProperty,
                    $navigationClass,
                );
                $reflectionProperty->setValue($navigation, $this->processNavigationByAttribute($navigationAttribute));
            }

            if (PageInterface::class === $className) {
                $pageAttribute = $this->getAttributeByInterface(
                    PageAttributeInterface::class,
                    $reflectionProperty,
                    $navigationClass,
                );
                $reflectionProperty->setValue($navigation, $this->processPageByAttribute($pageAttribute));
            }
        }

        return $navigation;
    }

    private function getAttributeByInterface(
        string $interfaceClass,
        ReflectionProperty $reflectionProperty,
        string $navigationClass,
    ): ?object {
        $allPropertyAttributes = $reflectionProperty->getAttributes();
        $property = $reflectionProperty->getName();

        $filteredAttributes = array_filter(
            $allPropertyAttributes,
            fn($attribute) => in_array($interfaceClass, class_implements($attribute->getName())),
        );

        if (empty($filteredAttributes)) {
            throw new Exception(
                "In property '$navigationClass::\$$property'} not founded attribute, that implement '$interfaceClass'",
            );
        }

        if (count($filteredAttributes) > 1) {
            throw new Exception(
                "In property '$navigationClass::\$$property'} founded more than one attribute, that implement '$interfaceClass'",
            );
        }

        return $filteredAttributes[array_key_first($filteredAttributes)]->newInstance();
    }

    private function processNavigationByAttribute(NavigationAttributeInterface $navigationAttribute): NavigationInterface
    {
        if ($navigationAttribute::class === CrudNavigationAttribute::class) {
            $crudNavigation = new CrudNavigation();
            $crudNavigation->create = $this->processPageByAttribute(
                new EntityFormPageAttribute($navigationAttribute->entityFormName, 'create'),
            );
            $crudNavigation->list = $this->processPageByAttribute(
                new EntityTablePageAttribute($navigationAttribute->entityTableName),
            );

            return $crudNavigation;
        }

        $navigationAttributeClass = $navigationAttribute::class;
        throw new Exception("Not found processor for navigation '$navigationAttributeClass'");
    }

    private function processPageByAttribute(PageAttributeInterface $pageAttribute): PageInterface
    {
        if ($pageAttribute::class === EntityFormPageAttribute::class) {
            $entityFormPage = new EntityFormPage($pageAttribute->name, $pageAttribute->mode);

            return $entityFormPage;
        }

        if ($pageAttribute::class === EntityTablePageAttribute::class) {
            $entityTablePage = new EntityTablePage($pageAttribute->name);

            return $entityTablePage;
        }

        if ($pageAttribute::class === FrontendPageAttribute::class) {
            $frontendPage = new FrontendPage($pageAttribute->component);

            return $frontendPage;
        }

        $pageAttributeClass = $pageAttribute::class;
        throw new Exception("Not found processor for '$pageAttributeClass'");
    }
}
