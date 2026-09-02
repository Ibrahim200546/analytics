<?php

declare(strict_types=1);

namespace App\Enum;

enum PeriodEnum: string
{
    case DAY = 'day';
    case WEEK = 'week';
    case MONTH = 'month';

    public static function getDays(PeriodEnum $period): int
    {
        return match ($period) {
            self::DAY => 1,
            self::WEEK => 7,
            self::MONTH => 31,
        };
    }
}
