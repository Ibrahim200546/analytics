<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Enum;

enum HiddenTypeEnum: string
{
    case HIDDEN = 'hidden';
    case FIELD_DISABLED = 'disabled';
}
