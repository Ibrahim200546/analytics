<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Enum;

enum EntityFormFieldEventNameEnum: string
{
    case ON_CHANGE = 'onChange';
    case ON_INIT = 'onInit';
}
