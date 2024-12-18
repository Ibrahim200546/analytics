<?php

declare(strict_types=1);

namespace Dexodus\SingleUniqueBundle\Controller;

use Dexodus\SingleUniqueBundle\Service\UniqueChecker;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SingleUniqueController
{
    public function __construct(
        private readonly UniqueChecker $uniqueChecker,
    ) {
    }

    #[Route('/entity-form/is-unique/{entityClass}/{property}/{value}', name: 'dexodus.single_unique.validator.is_unique')]
    public function isUnique(Request $request, string $entityClass, string $property, string $value = ''): Response
    {
        $entityId = $request->query->get('entityId');
        $result = $this->uniqueChecker->isUnique($entityClass, $property, $value, $entityId === 'undefined' ? null : $entityId);

        return new JsonResponse($result);
    }
}
