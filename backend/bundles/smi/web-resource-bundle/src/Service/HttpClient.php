<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

class HttpClient
{
    public function getCrawlerFromUrl(string $link): Crawler
    {
        return $this->getCrawlerFromHtml($this->getHtml($link));
    }

    public function getCrawlerFromHtml(string $html): Crawler
    {
        return new Crawler($html);
    }

    public function getHtml(string $link): string
    {
        $guzzleClient = new Client();

        $response = $guzzleClient->get('http://frontend:3000/api/parser?url=' .  $link);

        return json_decode($response->getBody()->getContents(), true)['html'];
    }
}
