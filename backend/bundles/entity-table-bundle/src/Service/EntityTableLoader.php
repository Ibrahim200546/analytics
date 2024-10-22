<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityTableBundle\Attribute\EntityTable as EntityTableAttribute;
use Dexodus\EntityFormBundle\EntityForm;
use Dexodus\EntityTableBundle\Dto\EntityTable;
use Dexodus\EntityTableBundle\Exception\NotFoundEntityTableException;
use Dexodus\TextCaseBundle\Enum\TextCaseEnum;
use Dexodus\TextCaseBundle\Service\WordsExtractor\WordsExtractor;
use Exception;
use ReflectionClass;

class EntityTableLoader implements EntityTableLoaderInterface
{
    /** @var EntityTable[] $entityTables */
    private array $entityTables = [];

    public function __construct(
        private readonly WordsExtractor $wordsExtractor,
    ) {
    }

    public function setEntityTables(array $entityTableClasses): void
    {
        foreach ($entityTableClasses as $entityTableClass) {
            $reflectionClass = new ReflectionClass($entityTableClass);
            $entityTableAttributes = $reflectionClass->getAttributes(EntityTableAttribute::class);

            foreach ($entityTableAttributes as $entityTableAttribute) {
                $entityTable = $this->createEntityTable(new $entityTableClass(), $entityTableAttribute->newInstance());

                if (array_key_exists($entityTable->name, $this->entityTables)) {
                    throw new Exception("Entity Table with name '$entityTable->name' has been duplicated");
                }

                $this->entityTables[$entityTable->name] = $entityTable;
            }
        }
    }

    public function createEntityTable(object $object, EntityTableAttribute $entityTableAttribute): EntityTable
    {
        $entityTable = new EntityTable();

        $entityTable->name = $entityTableAttribute->name ?? $this->convertClassToEntityFormName($object::class);
        $entityTable->entity = $object::class;
        $entityTable->table = $object;
        $entityTable->attribute = $entityTableAttribute;

        return $entityTable;
    }

    public function get(string $entityTableName): EntityTable
    {
        if (!isset($this->entityTables[$entityTableName])) {
            throw new NotFoundEntityTableException($entityTableName, array_keys($this->entityTables));
        }

        return $this->entityTables[$entityTableName];
    }

    /** @return EntityForm[] */
    public function getAll(): array
    {
        return $this->entityTables;
    }

    public function convertClassToEntityFormName(string $class): string
    {
        $classParts = explode('\\', $class);
        $nameParts = [];

        foreach ($classParts as $classPart) {
            $nameParts[] = implode('-', $this->wordsExtractor->extract($classPart, TextCaseEnum::CAMEL_CASE));
        }

        return mb_strtolower(implode('.', $nameParts));
    }

    public function has(string $entityTableName): bool
    {
        return array_key_exists($entityTableName, $this->entityTables);
    }
}
