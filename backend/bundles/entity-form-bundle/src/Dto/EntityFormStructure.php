<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

class EntityFormStructure
{
    public string $name;

    public string $entity;

    public array $paths;

    /** @var EntityFormField[] */
    public array $fields;

    /** @var EntityFormEvent[] */
    public array $events;

    public string $idColumn = 'id';

    public function getField(string $path): ?EntityFormField
    {
        foreach ($this->fields as $field) {
            if ($field->path === $path) {
                return $field;
            }
        }

        return null;
    }

    public function removeField(string $path): void
    {
        foreach ($this->fields as $index => $field) {
            if ($field->path === $path) {
                unset($this->fields[$index]);

                return;
            }
        }
    }
}
