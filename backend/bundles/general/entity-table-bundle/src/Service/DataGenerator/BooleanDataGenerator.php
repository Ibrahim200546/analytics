<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\DataGenerator;

use Dexodus\EntityTableBundle\Attribute\DataGenerator;
use ReflectionMethod;
use ReflectionProperty;
use ReflectionType;
use Symfony\Component\PropertyInfo\Type;

#[DataGenerator]
class BooleanDataGenerator implements DataGeneratorInterface
{
    public function generate(string $propertyPath, Type $type): ?string
    {
        if ($type->getBuiltinType() === 'bool') {
            return <<<"JSEL"
result = "Нет";
if ($propertyPath) {
result = "Да";
}
result
JSEL;
        }

        return null;
    }
}
