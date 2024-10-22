<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\DataGenerator;

use DateTimeImmutable;
use Dexodus\EntityTableBundle\Attribute\DataGenerator;
use ReflectionMethod;
use ReflectionProperty;
use ReflectionType;
use Symfony\Component\PropertyInfo\Type;

#[DataGenerator]
class DateTimeGenerator implements DataGeneratorInterface
{
    public function generate(string $propertyPath, Type $type): ?string
    {
        if ($type->getClassName() !== DateTimeImmutable::class) {
            return null;
        }

        return <<<JSEL
result = $propertyPath;
if (result) {
    if (momentFormat) {
        result = momentFormat($propertyPath, "DD MMMM YYYY, HH:mm");
    }
} else {
    result = "< Пусто >";
}
result
JSEL;
    }
}
