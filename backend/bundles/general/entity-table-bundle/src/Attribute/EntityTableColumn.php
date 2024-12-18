<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Attribute;

use Attribute;
use Dexodus\EntityFormBundle\Jsel\JselActionInterface;

#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_METHOD)]
readonly class EntityTableColumn
{
    public function __construct(
        private JselActionInterface|string|null $action = null,
        public ?string $nameForFilters = null,
        public ?array $options = [],
    ) {
    }

    public function getAction(): ?string
    {
        if (is_null($this->action)) {
            return null;
        }

        if ($this->action instanceof JselActionInterface) {
            return $this->action->generateAction();
        }

        return $this->action;
    }
}
