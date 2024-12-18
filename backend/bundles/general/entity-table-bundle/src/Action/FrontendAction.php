<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Action;

use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Service\WithTitleInterface;

readonly class FrontendAction implements ActionInterface, WithTitleInterface
{
    public function __construct(
        private string $title,
        private string $action,
        private ActionStyleEnum $style = ActionStyleEnum::Violet,
    ) {
    }

    public function configure(array $config): void
    {
    }

    public function onClick(): string
    {
        return "$this->action";
    }

    public function getStyle(): ActionStyleEnum
    {
        return $this->style;
    }

    public function isVisible(): string
    {
        return 'true';
    }

    public function getTitle(): string
    {
        return $this->title;
    }
}
