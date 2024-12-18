<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;

readonly class PathConstructor
{
    public function __construct(
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
    ) {
    }

    public function getPath(string $className, string $property, string $context = ''): string
    {
        $type = $this->propertyInfoExtractor->getTypes($className, $property)[0];

        if ($context !== '') {
            $context .= '.';
        }

        if ($type->isCollection()) {
            return $context . $property . '["*"]';
        }

        return $context . $property;
    }
}
