<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use Symfony\Component\Routing\RouterInterface;

class PathsGenerator
{
    public function __construct(
        private readonly ResourceMetadataCollectionFactoryInterface $resourceMetadataCollectionFactory,
        private readonly RouterInterface $router,
    ) {
    }

    public function generateForResource(string $resource, array $methods): array
    {
        $paths = [];

        foreach ($this->resourceMetadataCollectionFactory->create($resource) as $resourceMetadata) {
            foreach ($resourceMetadata->getOperations() as $operation) {
                foreach ($this->getMappingForMethods() as $pathName => $operationClasses) {
                    foreach ($operationClasses as $operationClass) {
                        $isInstanceOfOperation = is_subclass_of($operation, $operationClass) || $operation::class === $operationClass;

                        if (in_array($pathName, $methods) && $isInstanceOfOperation) {
                            $path = $this->router->getRouteCollection()->get($operation->getName())->getPath();
                            $paths[$pathName] = str_replace('{_format}', 'jsonld', $path);
                        }
                    }
                }
            }
        }

        return $paths;
    }

    private function getMappingForMethods(): array
    {
        return [
            'create' => [Post::class],
            'edit' => [Put::class],
            'get' => [Get::class],
            'collection' => [GetCollection::class],
        ];
    }
}
