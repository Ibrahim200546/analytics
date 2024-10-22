<?php

declare(strict_types=1);

namespace Dexodus\SearchEngineBundle\Service;

use cijic\phpMorphy\Morphy;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\AdminConstructorBundle\Service\NavigationManager;
use Dexodus\SearchEngineBundle\Dto\SystemItem;
use Dexodus\TranslationApiBundle\Service\TranslateService;
use ReflectionClass;

class AdminConstructorSearchEngine implements SearchEngineInterface
{
    public function __construct(
        private NavigationManager $navigationManager,
        private TranslateService $translateService,
    ) {
    }

    public function search(string $queryString): array
    {
        $navigation = $this->navigationManager->getNavigation();
        $systemItems = $this->getSystemItems($navigation);
        $filteredSystemItems = array_filter($systemItems, function (SystemItem $systemItem) use ($queryString) {
           return $this->filterSystemItem($queryString, $systemItem);
        });

        usort($filteredSystemItems, function (SystemItem $a, SystemItem $b) {
            if ($a->accuracy > $b->accuracy) {
                return -1;
            } else if ($a->accuracy < $b->accuracy) {
                return 1;
            }

            return 0;
        });

        return $filteredSystemItems;
    }

    public function filterSystemItem(string $queryString, SystemItem $systemItem): bool
    {
        $systemItemContent = mb_strtoupper($systemItem->content);
        $queryString = mb_strtoupper($queryString);

        if (str_contains($systemItemContent, $queryString)) {
            $systemItem->accuracy = 100;

            return true;
        }

        $systemItemContentParts = explode(' ', $systemItemContent);
        $queryStringParts = explode(' ', $queryString);

        $morphy = new Morphy('ru');
        $systemItemContentPartsAllForms = $morphy->getAllForms($systemItemContentParts);
        $queryStringPartsAllForms = array_values($morphy->getAllForms($queryStringParts));

        foreach ($queryStringPartsAllForms as $index => &$queryStringPartsAllForm) {
            if (!$queryStringPartsAllForm) {
                $queryStringPartsAllForm = [$queryStringParts[$index]];
            }
        }

        $queryStringPartIndex = 0;

        foreach ($systemItemContentPartsAllForms as $systemItemContentPartAllForms) {
            if (empty(array_intersect($systemItemContentPartAllForms, $queryStringPartsAllForms[$queryStringPartIndex]))) {
                $queryStringPartIndex = 0;
                continue;
            }

            $queryStringPartIndex++;

            if ($queryStringPartIndex >= count($queryStringParts)) {
                $systemItem->accuracy = 80;

                return true;
            }
        }

        return false;
    }

    /**
     * @return SystemItem[]
     */
    private function getSystemItems(array $navigation, string $context = 'navigation'): array
    {
        $result = [];

        foreach ($navigation as $name => $navigationItem) {
            if ($name === 'rootRedirect') {
                continue;
            }

            $path = "$context.$name";

            if (!$navigationItem instanceof PageInterface) {
                $result = [...$result, ...$this->getSystemItems($navigationItem, $path)];

                continue;
            }

            $navigationItemTitle = $this->translateService->translate($path, 'ru');
            $systemItem = new SystemItem();
            $systemItem->content = $navigationItemTitle;
            $systemItem->link = substr($path, strlen('navigation.'));
            $result[] = $systemItem;
        }

        return $result;
    }
}
