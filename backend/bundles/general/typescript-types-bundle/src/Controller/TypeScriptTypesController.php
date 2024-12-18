<?php

declare(strict_types=1);

namespace Dexodus\TypescriptTypesBundle\Controller;

use Dexodus\TypescriptTypesBundle\Service\TypescriptTypeGenerator;
use Dexodus\TypescriptTypesBundle\Service\TypescriptTypesLoaderInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TypeScriptTypesController
{
    public function __construct(
        private TypescriptTypesLoaderInterface $typescriptTypesLoader,
        private TypescriptTypeGenerator $typescriptTypeGenerator,
    ) {
    }

    #[Route('/typescript-types/all')]
    public function getTypes(): Response
    {
        $typescriptTypes = [];

        foreach ($this->typescriptTypesLoader->getAll() as $typescriptType) {
            $typescriptType->calculatedCode = $this->typescriptTypeGenerator->generate($typescriptType);
            $typescriptTypes[] = $typescriptType;
        }

        return new JsonResponse($typescriptTypes);
    }
}
