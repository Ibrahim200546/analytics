<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Enum;

enum TranslationCreationTypeEnum: string
{
    case MANUAL = 'manual';
    case AUTOMATIC = 'automatic';
}
