<?php

declare(strict_types=1);

namespace Dexodus\SearchEngineBundle\Controller;

use Dexodus\SearchEngineBundle\Service\AdminConstructorSearchEngine;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController
{
    public function __construct(
        private AdminConstructorSearchEngine $adminConstructorSearchEngine,
    ) {
    }

    #[Route('/search-engine/search/{search}')]
    public function search(string $search): Response
    {
        $results = $this->adminConstructorSearchEngine->search($search);

        return new JsonResponse($results);
    }
}
