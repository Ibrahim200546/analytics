<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Controller;

use Dexodus\EntityFormBundle\Service\Validator\UniqueChecker;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UniqueController
{
    public function __construct(
        private readonly UniqueChecker $uniqueChecker,
    ) {
    }

    #[Route('/entity-form/is-unique/{entityClass}/{property}/{value}', name: 'dexodus.entity_form.validator.is_unique')]
    public function isUnique(string $entityClass, string $property, string $value = ''): Response
    {
        $result = $this->uniqueChecker->isUnique($entityClass, $property, $value);

        return new JsonResponse($result);
    }
}
