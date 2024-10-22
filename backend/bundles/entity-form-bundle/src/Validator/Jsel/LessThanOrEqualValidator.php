<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator\Jsel;

use DateTimeImmutable;
use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\LessThanOrEqual;
use Symfony\Component\Validator\Constraints\Regex;

#[Validator(LessThanOrEqual::class)]
class LessThanOrEqualValidator implements ValidatorInterface
{
    /** @param LessThanOrEqual $constraintAttribute */
    public function generateRules(
        Constraint $constraintAttribute,
        string $entityClass,
        string $propertyPath,
    ): EntityFormValidator {
        $entityFormValidator = new EntityFormValidator();

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->message;

        $maxDateTime = (new DateTimeImmutable($constraintAttribute->value))->format('Y-m-d H:i:s');
        $entityFormValidator->rules = <<<JSEL
result = false;
if (currentValue || isString(currentValue)) {
    result = compareDates(currentValue, '$maxDateTime') != 1;
}
result
JSEL;

        return $entityFormValidator;
    }
}
