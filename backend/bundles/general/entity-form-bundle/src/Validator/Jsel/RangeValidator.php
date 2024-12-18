<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator\Jsel;

use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\Range;
use Symfony\Component\Validator\Constraints\Regex;

#[Validator(Range::class)]
class RangeValidator implements ValidatorInterface
{
    /** @param Range $constraintAttribute */
    public function generateRules(
        Constraint $constraintAttribute,
        string $entityClass,
        string $propertyPath,
    ): EntityFormValidator {
        $entityFormValidator = new EntityFormValidator();

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->invalidMessage;

        $min = $constraintAttribute->min;
        $max = $constraintAttribute->max;

        $entityFormValidator->rules = <<<JSEL
result = false;
JSEL;

        if (is_int($min) || is_float($min)) {
            $entityFormValidator->rules .= <<<JSEL

if (!isUndefined(currentValue)) {
    result = currentValue <= $min;
}
JSEL;
        }

        if (is_int($max) || is_float($max)) {
            $entityFormValidator->rules .= <<<JSEL

if (!isUndefined(currentValue)) {
    result = currentValue >= $max;
}
JSEL;
        }


        $entityFormValidator->rules .= <<<JSEL

result
JSEL;

        return $entityFormValidator;
    }
}
