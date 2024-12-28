<?php

declare(strict_types=1);

namespace Dexodus\TengrinewsApiBundle\Service;

use Dexodus\TengrinewsApiBundle\Enum\ToneEnum;
use GuzzleHttp\Client;

class RuSentiment
{
    public function analyze(string $text): ToneEnum
    {
        $guzzleClient = new Client();

        $response = $guzzleClient->post('http://tensorflow:8000/analyze', [
            'body' => json_encode(['text' => $text]),
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);

        $toneLabel = json_decode($response->getBody()->getContents(), true)['label'];

        return match ($toneLabel) {
            "NEGATIVE" => ToneEnum::NEGATIVE,
            "NEUTRAL" => ToneEnum::NEUTRAL,
            "POSITIVE" => ToneEnum::POSITIVE,
        };
    }
}
