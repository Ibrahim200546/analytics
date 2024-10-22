<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Action;

use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Service\WithTitleInterface;

readonly class RouterPush implements ActionInterface, WithTitleInterface
{
    public function __construct(
        private string $title,
        private string $url,
        private ActionStyleEnum $style = ActionStyleEnum::Violet,
    ) {
    }

    public function configure(array $config): void
    {
    }

    public function onClick(): string
    {
        return "routerPush($this->url)";
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
