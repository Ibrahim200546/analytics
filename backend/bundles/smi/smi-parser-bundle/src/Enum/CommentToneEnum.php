<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Enum;

enum CommentToneEnum: string
{
    case POSITIVE = 'positive';

    case NEGATIVE = 'negative';

    case NEUTRAL = 'neutral';

    case UNKNOWN = 'unknown';
}
