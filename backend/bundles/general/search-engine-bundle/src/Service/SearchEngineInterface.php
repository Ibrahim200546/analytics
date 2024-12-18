<?php

declare(strict_types=1);

namespace Dexodus\SearchEngineBundle\Service;

interface SearchEngineInterface
{
    public function search(string $queryString): array;
}
