<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

use Dexodus\EntityFormBundle\Enum\EntityFormEventNameEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormEventTypeEnum;
use Dexodus\EntityFormBundle\Jsel\JselActionInterface;
use Exception;

class EntityFormEvent
{
    public function __construct(
        public EntityFormEventTypeEnum $type,
        public EntityFormEventNameEnum $name,
        private mixed                  $action,
    ) {
    }

    public function getAction(): string
    {
        switch ($this->type) {
            case EntityFormEventTypeEnum::JSEL:
                if ($this->action instanceof JselActionInterface) {
                    return $this->action->generateAction();
                }

                if (is_string($this->action)) {
                    return $this->action;
                }

                throw new Exception('Undefined type of action.');
        }

        throw new Exception('Undefined type of event.');
    }
}
