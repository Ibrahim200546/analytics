<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Symfony\Component\Serializer\Annotation\Ignore;

class EntityFormField
{
    public string $path;

    public EntityFormFieldTypeEnum $type;
    public EntityFormFieldComponentEnum $component;
    public array $componentArguments = [];

    public string $title;

    /** @var EntityFormField[]|null  */
    public ?array $fields;

    /** @var EntityFormValidator[]|null  */
    public ?array $validators;

    /** @var EntityFormFieldEvent[]|null  */
    public ?array $events;

    #[Ignore]
    public int $priority = 0;

    /** @var mixed */
    public mixed $defaultValue;

    public ?bool $hidden;

    public string $sectionGroupKey;

    public function getField(string $path): ?EntityFormField
    {
        foreach ($this->fields ?? [] as $field) {
            if ($field->path === $path) {
                return $field;
            }
        }

        return null;
    }
}
