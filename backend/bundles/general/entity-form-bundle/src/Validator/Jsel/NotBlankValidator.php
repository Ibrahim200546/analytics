<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator\Jsel;

use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\NotBlank;

#[Validator(NotBlank::class)]
class NotBlankValidator implements ValidatorInterface
{
    /** @param NotBlank $constraintAttribute */
    public function generateRules(
        Constraint $constraintAttribute,
        string $entityClass,
        string $propertyPath,
    ): EntityFormValidator {
        $entityFormValidator = new EntityFormValidator();

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->message;
        $entityFormValidator->rules = 'currentValue != "" && isUndefined(currentValue) == false && currentValue != null';

        return $entityFormValidator;
    }
}
