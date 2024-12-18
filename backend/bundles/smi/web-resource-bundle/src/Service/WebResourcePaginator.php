<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Dexodus\WebResourceBundle\Entity\WebResource;
use Exception;

class WebResourcePaginator
{
    public function __construct(
        private HttpClient $httpClient,
    ) {
    }

    public function getFirstArticleLink(WebResource $webResource): string
    {
        return $this->getLinksFromOnePageWebResource($webResource->listArticlesLink, $webResource)[0];
    }

    public function getAllLinksWebResource(WebResource $webResource)
    {
        $currentPageLink = str_replace('{page}', '1', $webResource->articlesPathPattern);

        do {
            $attempt = 1;

            do {
                try {
                    yield $this->getLinksFromOnePageWebResource($currentPageLink, $webResource);
                    break;
                } catch (Exception) {
                    sleep(10);
                }
            } while ($attempt++ <= 3);

            $currentPageLink = $this->getNextPageLink($currentPageLink, $webResource);
        } while (!is_null($currentPageLink));
    }

    public function getLinksFromOnePageWebResource(string $pageUrl, WebResource $webResource): array
    {
        $crawler = $this->httpClient->getCrawlerFromUrl($pageUrl);
        $linkNodes = $crawler->filter($webResource->containerCssPath . ' ' . $webResource->articleLinkCssPath);
        $links = [];

        foreach ($linkNodes as $linkNode) {
            $link = $linkNode->attributes->getNamedItem('href')->nodeValue;

            if (in_array($link, $links)) {
                continue;
            }

            $links[] = $this->extendLink($webResource, $link);
        }

        return $links;
    }

    protected function extendLink(WebResource $webResource, string $link): string
    {
        if (str_starts_with($link, 'http')) {
            return $link;
        }

        if (str_starts_with($link, '/')) {
            $parsedUrl = parse_url($webResource->listArticlesLink);
            $baseUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];
            return $baseUrl . $link;
        }

        if (str_ends_with($webResource->listArticlesLink, '/')) {
            return $webResource->listArticlesLink . $link;
        }

        return $webResource->listArticlesLink . '/' . $link;
    }

    public function getNextPageLink(string $currentPageLink, WebResource $webResource): ?string
    {
        $fullLinkPattern = $this->extendLink($webResource, $webResource->articlesPathPattern);
        $fullCurrentPageLink = $this->extendLink($webResource, $currentPageLink);

        $currentPage = $this->extractPageFromLink($fullLinkPattern, $fullCurrentPageLink);

        if (is_null($currentPage) || !is_numeric($currentPage)) {
            return null;
        }

        $nextPageLink = str_replace('{page}', (string) ((int) $currentPage + 1), $fullLinkPattern);
        $linksElements = $this->httpClient->getCrawlerFromUrl($currentPageLink)->filter('a');

        foreach ($linksElements as $linksElement) {
            $link = $linksElement->attributes->getNamedItem('href')?->nodeValue;
            $fullLink = $this->extendLink($webResource, $link);

            if ($fullLink === $nextPageLink) {
                return $nextPageLink;
            }
        }

        return null;
    }

    public function extractPageFromLink(string $urlPattern, string $url): ?string
    {
        $pattern = preg_quote($urlPattern, '/'); // Экранируем спецсимволы
        $pattern = str_replace('\{page\}', '(\d*)', $pattern); // Заменяем {page} на группу для числа (или пустой строки)

        if (preg_match('/^' . $pattern . '$/', $url, $matches)) {
            return $matches[1]; // Первый захваченный результат
        }

        return null;
    }
}
