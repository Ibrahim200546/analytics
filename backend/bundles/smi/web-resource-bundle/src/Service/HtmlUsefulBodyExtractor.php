<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use DOMNode;
use Symfony\Component\DomCrawler\Crawler;

class HtmlUsefulBodyExtractor
{
    public function extract(Crawler $crawler): string
    {
        $crawler->filter('head, script, svg, noscript, iframe, form, button')->each(function (Crawler $node) {
            $node->getNode(0)->parentNode->removeChild($node->getNode(0));
        });
        $bodyHtml = $this->removeAttributes($this->removeTags($crawler->filter('body')))->html();
        $usefulHtml = preg_replace('/>\s+</', '><', trim($bodyHtml));

        return $usefulHtml;
    }

    private function removeTags(Crawler $crawler): Crawler
    {
        $emptyTags = ['div', 'span', 'p', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del', 'ins', 'a'];
        $deleted = true;

        while ($deleted) {
            $deleted = false;

            foreach ($crawler->filter(implode(', ', $emptyTags)) as $domElement) {
                if (trim((new Crawler($domElement))->html()) === '') {
                    $domElement->parentNode->removeChild($domElement);
                    $deleted = true;
                }
            }
        }

        return $crawler;
    }

    private function removeAttributes(Crawler $crawler): Crawler
    {
        $saveAttributes = [
            'div' => ['class', 'id'],
            'span' => ['class', 'id'],
            'p' => ['class', 'id'],
            'h1' => ['class', 'id'],
            'h2' => ['class', 'id'],
            'h3' => ['class', 'id'],
            'h4' => ['class', 'id'],
            'h5' => ['class', 'id'],
            'h6' => ['class', 'id'],
            'i' => ['class', 'id'],
            'b' => ['class', 'id'],
            'del' => ['class', 'id'],
            'ins' => ['class', 'id'],
            'a' => ['href', 'class', 'id'],
            'img' => ['src', 'alt', 'class', 'id'],
        ];

        foreach ($saveAttributes as $tagName => $attributes) {
            foreach ($crawler->filter($tagName) as $tagNode) {
                $deleteNames = [];

                foreach ($tagNode->attributes as $attributeNode) {
                    if (!in_array($attributeNode->nodeName, $attributes)) {
                        $deleteNames[] = $attributeNode->nodeName;
                    }
                }

                foreach ($deleteNames as $deleteName) {
                    $tagNode->removeAttribute($deleteName);
                }
            }
        }

        return $crawler;
    }
}

