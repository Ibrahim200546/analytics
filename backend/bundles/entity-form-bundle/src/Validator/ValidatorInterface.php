<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator;

use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Symfony\Component\Validator\Constraint;

interface ValidatorInterface
{
    public function generateRules(
        Constraint $constraintAttribute,
        string $entityClass,
        string $propertyPath,
    ): EntityFormValidator;
}
