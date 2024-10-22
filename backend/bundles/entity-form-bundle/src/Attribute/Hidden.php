<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Dto\EntityFormFieldEvent;
use Dexodus\EntityFormBundle\Dto\EntityFormField as EntityFormFieldDto;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldEventNameEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldEventTypeEnum;
use Dexodus\EntityFormBundle\Enum\HiddenTypeEnum;
use Dexodus\EntityFormBundle\Jsel\JselBuilder;

#[Attribute(Attribute::TARGET_PROPERTY)]
class Hidden extends AbstractFieldAttribute
{
    /**
     * @param string[] $groups
     */
    public function __construct(
        private array          $groups = [],
        private HiddenTypeEnum $type = HiddenTypeEnum::HIDDEN,
    )
    {
    }

    public function getGroups(): array
    {
        return $this->groups;
    }

    public function getType(): HiddenTypeEnum
    {
        return $this->type;
    }

    public function onBeforeCreateField(string $objectClass, string $property, string $context, ?EntityFormField $propertyAttribute, array $groups): bool
    {
        return $this->type === HiddenTypeEnum::HIDDEN && !empty(array_intersect($groups, empty($this->groups) ? ['Default'] : $this->groups));
    }

    public function onAfterCreateField(EntityFormFieldDto $field, array $groups): EntityFormFieldDto
    {
        if ($this->type === HiddenTypeEnum::FIELD_DISABLED && !empty(array_intersect($groups, empty($this->groups) ? ['Default'] : $this->groups))) {
            $jselBuilder = new JselBuilder();
            $jselBuilder->setVariableValue("disabled[\"entity.$field->path\"]", true);
            $field->events[] = new EntityFormFieldEvent(EntityFormFieldEventTypeEnum::JSEL, EntityFormFieldEventNameEnum::ON_INIT, $jselBuilder->getQuery());
        }

        return $field;
    }
}
