<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Enum;

enum ActionStyleEnum: string
{
    case Default = "Default";
    case Primary = "Primary";
    case Success = "Success";
    case Info = "Info";
    case Warning = "Warning";
    case Danger = "Danger";
    case Violet = "Violet";
}
