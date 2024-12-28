<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Service;

use DateTimeInterface;
use Dexodus\TypescriptTypesBundle\Dto\TypescriptType;
use ReflectionEnum;
use ReflectionNamedType;
use ReflectionProperty;
use ReflectionType;
use Symfony\Component\PropertyInfo\PropertyInfoExtractorInterface;
use Symfony\Component\PropertyInfo\Type;

class TypescriptTypeGenerator
{
    public function __construct(
        private PropertyInfoExtractorInterface $propertyInfoExtractor,
        private TypescriptTypesLoader $typescriptTypesLoader,
    ) {
    }

    public function generate(TypescriptType $typescriptType, ?array $customGroups = null): string
    {
        $implodedProperties = $this->generateProperties($typescriptType->originalClass, $customGroups ?? $typescriptType->groups);
        $importCodes = [];

        foreach (array_unique($implodedProperties['imports']) as $importName => $importPath) {
            $importRelativePath = $this->getRelativePathFromTypescriptTypeToImport($typescriptType->fullName, $importPath);
            if (!is_null($importRelativePath)) {
                $importCodes[] = <<<TS
import $importName from "$importRelativePath";
TS;
            }
        }

        $importCode = (!empty($importCodes) ? PHP_EOL : '') . implode(PHP_EOL, $importCodes) . (!empty($importCodes) ? PHP_EOL : '');

        $code = <<<TS
/* Typescript Type "$typescriptType->fullName" */
$importCode
interface $typescriptType->name {
{$implodedProperties['code']}
}

export default $typescriptType->name;

TS;

        return $code;
    }

    private function getRelativePathFromTypescriptTypeToImport(string $from, string $to): ?string
    {
        $fromParts = explode('/', trim($from, '/'));
        $toParts = explode('/', trim($to, '/'));
        $commonLength = 0;

        while ($commonLength < count($fromParts) && $commonLength < count($toParts) && $fromParts[$commonLength] === $toParts[$commonLength]) {
            $commonLength++;
        }

        if (count($fromParts) - $commonLength - 1 <= 0) {
            return null;
        }

        $upwards = array_fill(0, count($fromParts) - $commonLength - 1, '..') ;
        $downwards = array_slice($toParts, $commonLength);
        $relativePath = implode('/', array_merge(count($upwards) === 0 ? ['.'] : $upwards, $downwards));

        return $relativePath ?: './';
    }

    private function generateProperties(string $class, array $groups = [], int $depth = 1): array
    {
        $properties = $this->propertyInfoExtractor->getProperties($class, ['serializer_groups' => $groups]);

        $processedPropertyCodes = [];
        $imports = [];

        foreach ($properties as $property) {
            $processedProperty = $this->processProperty($class, $property, $groups, $depth);
            $processedPropertyCodes[] = $processedProperty['code'];
            $imports = [...$imports, ...$processedProperty['imports']];
        }

        return [
            'imports' => $imports,
            'code' => implode(PHP_EOL, array_map(fn (string $processedPropertyCode) => str_repeat('   ', $depth) . $processedPropertyCode, $processedPropertyCodes)),
        ];
    }

    private function processProperty(string $class, string $property, array $groups, int $depth): array
    {
        $types = $this->propertyInfoExtractor->getTypes($class, $property);

        $reflectionProperty = new ReflectionProperty($class, $property);
        $reflectionType = $reflectionProperty->getType();

        $processedTypes = $this->processTypes($class, $types, $reflectionType, $groups, $depth);

        return [
            'imports' => $processedTypes['imports'],
            'code' => "$property: {$processedTypes['code']};",
        ];
    }

    /**
     * @param Type[]|null $types
     * @param ?ReflectionType $reflectionType
     * @param array $groups
     * @param int $depth
     * @return array
     */
    private function processTypes(string $class, null|array $types, ?ReflectionType $reflectionType, array $groups, int $depth): array
    {
        $tsTypes = [];
        $imports = [];

        if (!is_null($types)) {
            foreach ($types as $type) {
                if (!in_array('number', $tsTypes) && ($type->getBuiltinType() === 'int' || $type->getBuiltinType() === 'float' || $type->getBuiltinType() === 'double')) {
                    $tsTypes[] = 'number';
                } elseif (!is_null($type->getClassName()) && enum_exists($type->getClassName())) {
                    $enumReflection = new ReflectionEnum($type->getClassName());

                    if ($enumReflection->getBackingType()) {
                        foreach ($enumReflection->getCases() as $case) {
                            $tsTypes[] = $enumReflection->getBackingType()->getName() === 'string' ? '"' . $case->getBackingValue() . '"' : $case->getBackingValue();
                        }
                    }
                } elseif ($type->getBuiltinType() === 'string') {
                    $tsTypes[] = 'string';
                } elseif ($type->getBuiltinType() === 'bool') {
                    $tsTypes[] = 'boolean';
                } elseif (!is_null($type->getClassName()) && in_array(DateTimeInterface::class, class_implements($type->getClassName()))) {
                    if (!in_array('string', $tsTypes)) {
                        $tsTypes[] = 'string';
                    }
                } elseif (!is_null($type->getClassName()) && !$type->isCollection() && $type->getClassName() === $class) {
                    $subTypescriptTypes = $this->typescriptTypesLoader->getTypescriptTypesForClass($type->getClassName());
                    $findSubTypescriptType = null;

                    foreach ($subTypescriptTypes as $subTypescriptType) {
                        if (count(array_intersect($subTypescriptType->groups, $groups)) === count($subTypescriptType->groups)) {
                            $findSubTypescriptType = $subTypescriptType;
                            break;
                        }
                    }

                    $imports[$findSubTypescriptType->name] = $findSubTypescriptType->fullName;
                    $tsTypes[] = "{$findSubTypescriptType->name}";
                }  elseif (!is_null($type->getClassName()) && $type->isCollection() && $type->getClassName() === $class) {
                    $subTypescriptTypes = $this->typescriptTypesLoader->getTypescriptTypesForClass($type->getCollectionValueTypes()[0]->getClassName());
                    $findSubTypescriptType = null;

                    foreach ($subTypescriptTypes as $subTypescriptType) {
                        if (count(array_intersect($subTypescriptType->groups, $groups)) === count($subTypescriptType->groups)) {
                            $findSubTypescriptType = $subTypescriptType;
                            break;
                        }
                    }

                    $imports[$findSubTypescriptType->name] = $findSubTypescriptType->fullName;
                    $tsTypes[] = "{$findSubTypescriptType->name}[]";
                } elseif (!is_null($type->getClassName()) && !$type->isCollection()) {
                    $subType = $this->generateProperties($type->getClassName(), $groups, $depth + 1);

                    $subTypescriptTypes = $this->typescriptTypesLoader->getTypescriptTypesForClass($type->getClassName());

                    $findSubTypescriptType = null;

                    foreach ($subTypescriptTypes as $subTypescriptType) {
                        if ($this->generate($subTypescriptType) === $this->generate($subTypescriptType, $groups)) {
                            $findSubTypescriptType = $subTypescriptType;
                            break;
                        }
                    }

                    if (is_null($findSubTypescriptType)) {
                        $imports = [...$imports, ...$subType['imports']];
                        if ($subType['code'] === '') {
                            $tsTypes[] = '{}';
                        } else {
                            $tsTypes[] = "{\n{$subType['code']}\n" . str_repeat('   ', $depth) . '}';
                        }
                    } else {
                        $imports[$findSubTypescriptType->name] = $findSubTypescriptType->fullName;
                        $tsTypes[] = "{$findSubTypescriptType->name}";
                    }
                } elseif ($type->isCollection()) {
                    $subType = $this->processTypes($class, $type->getCollectionValueTypes(), null, $groups, $depth);
                    $tsTypes[] = "({$subType['code']})[]";
                    $imports = [...$imports, ...$subType['imports']];
                }

                if ($type->isNullable()) {
                    $tsTypes[] = 'null';
                }
            }
        } elseif ($reflectionType instanceof ReflectionNamedType) {
            $tsTypes[] = match ($reflectionType->getName()) {
                'mixed' => 'any',
                'null' => 'null',
            };
        }

        $codeType = implode(' | ', $tsTypes);

        return [
            'imports' => $imports,
            'code' => "$codeType",
        ];
    }
}
