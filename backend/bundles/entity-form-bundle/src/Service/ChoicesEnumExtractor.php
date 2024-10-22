<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\TitleBundle\Service\TitleExtractor;
use ReflectionEnum;

class ChoicesEnumExtractor
{
    public function __construct(
        private TitleExtractor $titleExtractor,
    ) {
    }

    public function extract(string $class): array
    {
        $reflectionEnum = new ReflectionEnum($class);
        $enumCases = $reflectionEnum->getCases();
        $choices = [];

        foreach ($enumCases as $enumCase) {
            $name = $enumCase->getBackingValue();
            $title = $this->titleExtractor->extractTitleFromEnumCase($class, $enumCase->name) ?? $name;
            $choices[$name] = $title;
        }

        return $choices;
    }
}
