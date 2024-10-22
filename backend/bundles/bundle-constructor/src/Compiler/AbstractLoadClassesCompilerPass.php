<?php

declare(strict_types=1);

namespace Dexodus\BundleConstructor\Compiler;

use Dexodus\EntityFormBundle\Attribute\EntityForm as EntityFormAttribute;
use Dexodus\EntityImportBundle\Service\ImportMapRepositoryInterface;
use Exception;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

abstract class AbstractLoadClassesCompilerPass implements CompilerPassInterface
{
//    public function process(ContainerBuilder $container)
//    {
//        $repositoryClass = $container->getParameter('entity-import.repository');
//        $repositoryInterface = ImportMapRepositoryInterface::class;
//        $mapping = $container->getParameter('entity-import.mapping');
//        $this->loadClasses($container, $repositoryClass, $repositoryInterface, $mapping);
//    }

    protected function loadClasses(
        ContainerBuilder $container,
        string $repositoryClass,
        ?string $repositoryInterface,
        array $mapping,
    ): void {
        if (!$container->hasDefinition($repositoryClass)) {
            $container->setDefinition($repositoryClass, new Definition($repositoryClass));
        }

        if (!is_null($repositoryInterface)) {
            $container->setAlias($repositoryInterface, $repositoryClass);
        }

        $repository = $container->findDefinition($repositoryClass);
        $classes = [];

        foreach ($mapping as $item) {
            $potentialClassPaths = scandir($item['dir']);

            if ($potentialClassPaths === false) {
                throw new Exception("Directory '{$item['dir']}' not found for load required classes");
            }

            $classes = [...$classes, ...$this->scanDirectoryAndAddClassToRepository($item['dir'], $item['prefix'])];
        }

        $methodName = $this->getRepositorySetClassesMethodName();
        $repository->addMethodCall($methodName, [array_unique($classes)]);
    }

    private function scanDirectoryAndAddClassToRepository(string $directory, string $prefix): array
    {
        $classes = [];

        foreach (scandir($directory) as $path) {
            if ($path === '.' || $path === '..') {
                continue;
            }

            $filepath = $directory . '/' . $path;
            $class = $prefix . '\\' . str_replace('.php', '', $path);

            if (!class_exists($class)) {
                if (is_dir($filepath)) {
                    $classes = [...$classes, ...$this->scanDirectoryAndAddClassToRepository($filepath, $prefix . '\\' . $path)];
                }

                continue;
            }

            $entityFormAttributes = $this->getRequiredAttributes($class);

            if (count($entityFormAttributes) === 0) {
                continue;
            }

            $classes[] = $class;
        }

        return $classes;
    }

    /** @return ReflectionAttribute[] */
    private function getRequiredAttributes(string $class): array
    {
        $reflectionClass = new ReflectionClass($class);

        return $reflectionClass->getAttributes($this->getRequiredAttributeClass());
    }

    abstract protected function getRequiredAttributeClass(): string;
    abstract protected function getRepositorySetClassesMethodName(): string;
}
