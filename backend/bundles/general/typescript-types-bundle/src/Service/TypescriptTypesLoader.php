<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Service;

use Dexodus\TextCaseBundle\Service\WordsExtractor\WordsExtractor;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Dexodus\TypescriptTypesBundle\Dto\TypescriptType;
use Dexodus\TypescriptTypesBundle\Exception\NotFoundTypescriptTypeException;
use Exception;
use ReflectionClass;

class TypescriptTypesLoader implements TypescriptTypesLoaderInterface
{
    /** @var TypescriptType[] $entityForms */
    private array $typescriptTypes = [];

    public function setTypescriptTypes(array $typescriptTypes): void
    {
        foreach ($typescriptTypes as $typescriptTypeClass) {
            $reflectionClass = new ReflectionClass($typescriptTypeClass);
            $asTSTypeAttributes = $reflectionClass->getAttributes(AsTSType::class);

            foreach ($asTSTypeAttributes as $asTSTypeAttribute) {
                $typescriptType = $this->createTypescriptType(new $typescriptTypeClass(), $asTSTypeAttribute->newInstance());

                if (array_key_exists($typescriptType->fullName, $this->typescriptTypes)) {
                    throw new Exception("Typescript Type with name '$typescriptType->fullName' has been duplicated");
                }

                $this->typescriptTypes[$typescriptType->fullName] = $typescriptType;
            }
        }
    }

    private function createTypescriptType(object $object, AsTSType $asTSType): TypescriptType
    {
        $typescriptType = new TypescriptType();

        $classParts = explode('\\', $object::class);
        $namespace = $asTSType->namespace ?? implode('/', array_slice($classParts, 0, -1));
        $name = $asTSType->name ?? end($classParts);

        $typescriptType->name = $name;
        $typescriptType->fullName = $namespace . '/' . $name;
        $typescriptType->originalClass = $object::class;
        $typescriptType->groups = $asTSType->groups;

        return $typescriptType;
    }

    public function get(string $typescriptTypeName): TypescriptType
    {
        if (!$this->has($typescriptTypeName)) {
            throw new NotFoundTypescriptTypeException($typescriptTypeName, array_keys($this->typescriptTypes));
        }

        return $this->typescriptTypes[$typescriptTypeName];
    }

    /** @return TypescriptType[] */
    public function getAll(): array
    {
        return $this->typescriptTypes;
    }

    public function has(string $typescriptTypeName): bool
    {
        return array_key_exists($typescriptTypeName, $this->typescriptTypes);
    }

    /** @return TypescriptType[] */
    public function getTypescriptTypesForClass(string $class): array
    {
        return array_values(array_filter($this->typescriptTypes, fn (TypescriptType $typescriptType) => $typescriptType->originalClass === $class));
    }
}
