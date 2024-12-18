<?php

namespace Dexodus\WebResourceBundle\Service;

use DateTimeImmutable;
use DateTimeZone;
use Exception;

class WebResourceDateTimeParser
{
    private array $monthsMap = [
        // Полные формы
        'января' => 'January', 'февраля' => 'February', 'марта' => 'March',
        'апреля' => 'April', 'мая' => 'May', 'июня' => 'June',
        'июля' => 'July', 'августа' => 'August', 'сентября' => 'September',
        'октября' => 'October', 'ноября' => 'November', 'декабря' => 'December',

        // Короткие формы
        'янв.' => 'Jan', 'фев.' => 'Feb', 'мар.' => 'Mar',
        'апр.' => 'Apr', 'май' => 'May', 'июн.' => 'Jun',
        'июл.' => 'Jul', 'авг.' => 'Aug', 'сен.' => 'Sep',
        'окт.' => 'Oct', 'ноя.' => 'Nov', 'дек.' => 'Dec',
    ];

    private array $specialSymbols = [
        '|' => '-',
    ];


    /**
     * Преобразует текстовую дату в объект DateTimeImmutable
     *
     * @param string $dateString Текстовая дата (например, "17 декабря 2024, 14:30")
     * @param string $format Шаблон даты (например, "d MMMM yyyy, HH:mm")
     * @param string|null $timezone Часовой пояс (по умолчанию UTC)
     *
     * @return DateTimeImmutable
     * @throws Exception
     */
    public function parse(string $dateString, string $format, ?string $timezone = 'UTC'): DateTimeImmutable
    {
        $dateString = mb_strtolower($dateString);
        $dateString = str_replace(array_keys($this->specialSymbols), array_values($this->specialSymbols), strtr($dateString, $this->monthsMap));

        $dateTimeZone = new DateTimeZone($timezone);

        $format = str_replace(array_keys($this->specialSymbols), array_values($this->specialSymbols), $format);
        $dateTime = DateTimeImmutable::createFromFormat($format, $dateString, $dateTimeZone);

        if (!$dateTime) {
            throw new Exception("Не удалось преобразовать дату: '{$dateString}' с шаблоном '{$format}'.");
        }

        return $dateTime;
    }
}
