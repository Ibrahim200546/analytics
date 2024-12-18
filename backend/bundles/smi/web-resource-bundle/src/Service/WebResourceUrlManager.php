<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Dexodus\WebResourceBundle\Entity\WebResource;

class WebResourceUrlManager
{
    public function extractOptionsFromUrl(string $pattern, string $url): ?array
    {
        $optionKeysMatches = [];

        preg_match_all('/\{(.+?)\}/', $pattern, $optionKeysMatches);
        $optionKeys = $optionKeysMatches[1];
        $patternOptions = [];

        foreach ($optionKeys as $optionKey) {
            $patternOptions[$optionKey] = '_OPTION_';
        }

        $regexPattern = str_replace('_OPTION_', '(.*)', preg_quote($this->buildUrlByPattern($pattern, $patternOptions), '/'));
        $optionsMatches = [];
        preg_match("/$regexPattern/", $url, $optionsMatches);

        if (count($optionKeys) !== count($optionsMatches) - 1) {
            return null;
        }

        return array_combine($optionKeys, array_slice($optionsMatches, 1));
    }

    public function buildUrlByPattern(string $pattern, array $options = []): string
    {
        foreach ($options as $optionKey => $optionValue) {
            $pattern = str_replace('{' . $optionKey . '}', (string) $optionValue, $pattern);
        }

        return $pattern;
    }

    public function extendUrl(WebResource $webResource, string $url): string
    {
        if (str_starts_with($url, 'http')) {
            return $url;
        }

        if (str_starts_with($url, '/')) {
            $parsedUrl = parse_url($webResource->listArticlesLink);
            $baseUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];
            return $baseUrl . $url;
        }

        if (str_ends_with($webResource->listArticlesLink, '/')) {
            return $webResource->listArticlesLink . $url;
        }

        return $webResource->listArticlesLink . '/' . $url;
    }
}
