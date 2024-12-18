<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Symfony\Component\DomCrawler\Crawler;

class HtmlUsefulBodyExtractor
{
    public function extract(Crawler $crawler): string
    {
        $crawler->filter('head, script, svg, noscript')->each(function (Crawler $node) {
            $node->getNode(0)->parentNode->removeChild($node->getNode(0));
        });
        $bodyHtml = $crawler->filter('body')->html();

        return preg_replace('/>\s+</', '><', trim($bodyHtml));
    }
}

