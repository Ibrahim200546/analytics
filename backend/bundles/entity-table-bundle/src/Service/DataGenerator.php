<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityFormBundle\Service\PathConstructor;
use Dexodus\EntityTableBundle\Service\DataGenerator\DataGeneratorInterface;
use ReflectionMethod;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;

class DataGenerator
{
    /** @var DataGeneratorInterface[] $dataGenerators */
    private array $dataGenerators = [];

    public function __construct(
        private PathConstructor $pathConstructor,
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
    ) {
    }

    public function setDataGenerators(array $dataGenerators): void
    {
        $this->dataGenerators = $dataGenerators;
    }

    public function generate(string $objectClass, string $property, ReflectionProperty|ReflectionMethod $reflectionProperty): string
    {
        $propertyPath = $this->pathConstructor->getPath($objectClass, $property);
        $defaultData = $this->pathConstructor->getPath($objectClass, $propertyPath, 'entity');

        foreach ($this->dataGenerators as $dataGenerator) {
            $data = $dataGenerator->generate($defaultData, $this->propertyInfoExtractor->getTypes($objectClass, $property)[0]);

            if (!is_null($data)) {
                return str_replace("\n", ' ', $data);
            }
        }

        return $defaultData;
    }
}
