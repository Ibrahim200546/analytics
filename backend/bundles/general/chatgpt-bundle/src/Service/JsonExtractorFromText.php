<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Service;

class JsonExtractorFromText
{
    public function extract(string $text): string
    {
        $startJsonIndex = strpos($text, '{');
        $endJsonIndex = strrpos($text, '}');

        return substr($text, $startJsonIndex, $endJsonIndex - $startJsonIndex + 1);
    }
}
