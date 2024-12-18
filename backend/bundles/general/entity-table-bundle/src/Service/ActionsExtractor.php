<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Service;

use Dexodus\EntityTableBundle\Dto\EntityTable;
use Dexodus\TitleBundle\Service\TitleExtractor;
use Symfony\Bundle\SecurityBundle\Security;

class ActionsExtractor
{
    public function __construct(
        private TitleExtractor $titleExtractor,
        private Security $security,
    ) {
    }

    public function getActions(EntityTable $entityTable): array
    {
        $actions = [];

        foreach ($entityTable->attribute->actions as $action) {
            $action->configure([
                'actionId' => count($actions),
                'name' => $entityTable->name,
                'user' => $this->security->getUser(),
            ]);

            $actions[] = [
                'style' => $action->getStyle(),
                'onClick' => $action->onClick(),
                'title' => $this->titleExtractor->extractTitleFromObject($action),
                'isVisible' => $action->isVisible(),
            ];
        }

        return $actions;
    }
}
