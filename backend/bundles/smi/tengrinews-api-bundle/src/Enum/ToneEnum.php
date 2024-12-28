<?php

declare(strict_types=1);

namespace Dexodus\TengrinewsApiBundle\Enum;

enum ToneEnum: string
{
    case POSITIVE = 'positive';

    case NEGATIVE = 'negative';

    case NEUTRAL = 'neutral';
}
