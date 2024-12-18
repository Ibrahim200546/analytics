<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\DataGenerator;

use Symfony\Component\PropertyInfo\Type;

interface DataGeneratorInterface
{
    public function generate(string $propertyPath, Type $type): ?string;
}
