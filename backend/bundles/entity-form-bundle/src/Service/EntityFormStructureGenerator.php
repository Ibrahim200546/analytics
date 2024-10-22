<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\Dto\EntityFormStructure;
use Dexodus\EntityFormBundle\Exception\NotSupportedModeException;
use Doctrine\ORM\Mapping\Id;
use ReflectionClass;

class EntityFormStructureGenerator implements EntityFormStructureGeneratorInterface
{
    public function __construct(
        private readonly EntityFormLoaderInterface $entityFormLoader,
        private readonly FieldsGenerator $fieldsGenerator,
        private readonly PathsGenerator $pathsGenerator,
    ) {
    }

    public function generate(string $entityFormName, string $modeType): EntityFormStructure
    {
        $entityForm = $this->entityFormLoader->get($entityFormName);
        $supportedMethods = [];
        $groups = [];

        foreach ($entityForm->attribute->modes as $mode) {
            if (!empty($mode->groups)) {
                $supportedMethods[] = '\'' . $mode->type . '\'';
            }

            if ($mode->type === $modeType) {
                $groups = $mode->groups;

                break;
            }
        }

        if (empty($groups)) {
            throw new NotSupportedModeException($entityForm->form::class, $modeType, $supportedMethods);
        }

        $entityFormStructure = new EntityFormStructure();
        $entityFormStructure->name = $entityForm->name;
        $entityFormStructure->entity = $entityForm->entity;
        $entityFormStructure->fields = $this->fieldsGenerator->generate($entityForm->form::class, '', $groups);
        $entityFormStructure->paths = array_merge($this->pathsGenerator->generateForResource(
            $entityForm->entity,
            $entityForm->attribute->methods,
        ), $entityForm->attribute->paths ?? []);
        $entityFormStructure->events = $entityForm->attribute->events;
        $entityFormStructure->idColumn = $this->getIdColumn($entityForm->entity);

        return $entityFormStructure;
    }

    private function getIdColumn(string $entityClass): string
    {
        $reflectionClass = new ReflectionClass($entityClass);

        foreach ($reflectionClass->getProperties() as $reflectionProperty) {
            if (!empty($reflectionProperty->getAttributes(Id::class))) {
                return $reflectionProperty->name;
            }
        }

        return 'id';
    }
}
