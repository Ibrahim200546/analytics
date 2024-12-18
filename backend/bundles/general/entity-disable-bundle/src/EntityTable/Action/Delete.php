<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\EntityTable\Action;

use Dexodus\EntityDisableBundle\EntityTable\DisableAction;
use Dexodus\EntityTableBundle\Action\BackendAction;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;

class Delete extends BackendAction
{
    public function __construct(string $title = 'Удалить', string $visibleStatement = 'true', ActionStyleEnum $style = ActionStyleEnum::Danger)
    {
        parent::__construct($title, DisableAction::class, $visibleStatement, $style);
    }
}
