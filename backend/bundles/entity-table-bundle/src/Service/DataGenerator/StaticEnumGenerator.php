<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service\DataGenerator;

use Dexodus\EntityTableBundle\Attribute\DataGenerator;
use Dexodus\TitleBundle\Service\TitleExtractor;
use ReflectionEnum;
use ReflectionMethod;
use ReflectionProperty;
use ReflectionType;
use Symfony\Component\PropertyInfo\Type;

#[DataGenerator]
readonly class StaticEnumGenerator implements DataGeneratorInterface
{
    public function __construct(
        private TitleExtractor $titleExtractor,
    ) {
    }

    public function generate(string $propertyPath, Type $type): ?string
    {
        if (!$type->getClassName() || !class_exists($type->getClassName())) {
            return null;
        }

        if (!enum_exists($type->getClassName())) {
            return null;
        }

        $reflectionEnum = new ReflectionEnum($type->getClassName());
        $result = <<<JSEL
result = $propertyPath; 
JSEL;

        foreach ($reflectionEnum->getCases() as $case) {
            $value = $case->getBackingValue();
            $title = $this->titleExtractor->extractTitleFromEnumCase($reflectionEnum->getName(), $case->getName()) ?? $case->getName();

            $result .= <<<JSEL
if ($propertyPath == "$value") { result = "$title" } 
JSEL;
        }

        $result .= <<<JSEL
result
JSEL;


        return $result;
    }
}
