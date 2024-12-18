<?php

declare(strict_types=1);

namespace Dexodus\TitleBundle\Service;

use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TitleBundle\Exception\ExpectedOneTitleException;
use Exception;
use ReflectionClass;
use ReflectionEnum;
use ReflectionMethod;
use ReflectionProperty;

class TitleExtractor
{
    public function extractTitleFromObject(object $object): ?string
    {
        if ($object instanceof WithTitleInterface) {
            return $object->getTitle();
        }

        return $this->extractTitleFromClass($object::class);
    }

    public function extractTitleFromClass(string $class): ?string
    {
        $reflectionClass = new ReflectionClass($class);
        $titleAttributes = $reflectionClass->getAttributes(Title::class);

        if (count($titleAttributes) > 1) {
            throw new ExpectedOneTitleException();
        }

        if (empty($titleAttributes)) {
            return null;
        }

        /** @var Title $titleAttribute */
        $titleAttribute = $titleAttributes[0]->newInstance();

        return $titleAttribute->value;
    }

    public function extractTitleFromProperty(string $class, string $property): ?string
    {
        try {
            $reflectionProperty = new ReflectionProperty($class, $property);
        } catch (Exception) {
            $reflectionProperty = new ReflectionMethod($class, 'get' . ucfirst($property));
        }
        $titleAttributes = $reflectionProperty->getAttributes(Title::class);

        if (count($titleAttributes) > 1) {
            throw new ExpectedOneTitleException();
        }

        if (empty($titleAttributes)) {
            return null;
        }

        /** @var Title $titleAttribute */
        $titleAttribute = $titleAttributes[0]->newInstance();

        return $titleAttribute->value;
    }

    public function extractTitleFromEnumCase(string $enumClass, string $caseName): ?string
    {
        $reflectionEnum = new ReflectionEnum($enumClass);
        $reflectionCase = $reflectionEnum->getCase($caseName);
        $titleAttributes = $reflectionCase->getAttributes(Title::class);

        if (count($titleAttributes) > 1) {
            throw new ExpectedOneTitleException();
        }

        if (empty($titleAttributes)) {
            return null;
        }

        /** @var Title $titleAttribute */
        $titleAttribute = $titleAttributes[0]->newInstance();

        return $titleAttribute->value;
    }
}
