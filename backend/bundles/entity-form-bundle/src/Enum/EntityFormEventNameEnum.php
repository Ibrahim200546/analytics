<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Enum;

enum EntityFormEventNameEnum: string
{
    case ON_BEFORE_SEND = 'onBeforeSend';
    case ON_AFTER_CREATE = 'onAfterCreate';
    case ON_AFTER_EDIT = 'onAfterEdit';
}
