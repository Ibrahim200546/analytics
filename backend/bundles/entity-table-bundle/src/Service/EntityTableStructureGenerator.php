<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityFormBundle\Exception\MoreThenOneAttributeException;
use Dexodus\EntityFormBundle\Service\PathsGenerator;
use Dexodus\EntityTableBundle\Dto\EntityTableStructure;
use Dexodus\EntityTableBundle\Exception\NotFoundEntityTableException;

class EntityTableStructureGenerator implements EntityTableStructureGeneratorInterface
{
    public function __construct(
        private readonly EntityTableLoaderInterface $entityTableLoader,
        private readonly ColumnGenerator $columnGenerator,
        private readonly PathsGenerator $pathsGenerator,
        private readonly EntityFilterExtractor $entityFilterExtractor,
        private readonly ActionsExtractor $actionsExtractor,
    ) {
    }

    /**
     * @throws NotFoundEntityTableException
     * @throws MoreThenOneAttributeException
     */
    public function generate(string $entityTableName, ?array $options = []): EntityTableStructure
    {
        $entityTable = $this->entityTableLoader->get($entityTableName);

        $entityTableStructure = new EntityTableStructure();
        $entityTableStructure->name = $entityTable->name;
        $entityTableStructure->entity = $entityTable->entity;
        $entityTableStructure->columns = $this->columnGenerator->generate($entityTable->entity, $options);

        $paths = $this->pathsGenerator->generateForResource($entityTable->entity, ['collection']);
        $entityTableStructure->path = $entityTable->attribute->path ?? $paths['collection'];
        $entityTableStructure->actions = $this->actionsExtractor->getActions($entityTable);
        $this->entityFilterExtractor->fillFiltersInStructure($entityTableStructure);

        return $entityTableStructure;
    }
}
