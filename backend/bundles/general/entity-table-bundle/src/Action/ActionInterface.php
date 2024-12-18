<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Action;

use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;

interface ActionInterface
{
    public function configure(array $config): void;
    public function onClick(): string;
    public function getStyle(): ActionStyleEnum;
    public function isVisible(): string;
}
