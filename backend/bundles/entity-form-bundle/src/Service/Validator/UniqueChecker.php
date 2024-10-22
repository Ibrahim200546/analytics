<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\Validator;

use Doctrine\ORM\EntityManagerInterface;

class UniqueChecker
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function isUnique(string $entityClass, string $property, string $value): bool
    {
        $repository = $this->entityManager->getRepository($entityClass);

        return is_null($repository->findOneBy([$property => $value]));
    }
}
