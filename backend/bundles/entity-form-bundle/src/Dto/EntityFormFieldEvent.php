<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

use Dexodus\EntityFormBundle\Enum\EntityFormFieldEventNameEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldEventTypeEnum;
use Dexodus\EntityFormBundle\Jsel\JselActionInterface;
use Exception;

class EntityFormFieldEvent
{
    public function __construct(
        public EntityFormFieldEventTypeEnum $type,
        public EntityFormFieldEventNameEnum $name,
        protected mixed                     $action,
    )
    {
    }

    public function getAction(): mixed
    {
        switch ($this->type) {
            case EntityFormFieldEventTypeEnum::JSEL:
                if (is_string($this->action)) {
                    return $this->action;
                } elseif ($this->action instanceof JselActionInterface) {
                    return $this->action->generateAction();
                } else {
                    throw new Exception();
                }
        }

        return $this->action;
    }
}
