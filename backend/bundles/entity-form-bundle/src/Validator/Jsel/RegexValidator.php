<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator\Jsel;

use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\Regex;

#[Validator(Regex::class)]
class RegexValidator implements ValidatorInterface
{
    /** @param Regex $constraintAttribute */
    public function generateRules(
        Constraint $constraintAttribute,
        string $entityClass,
        string $propertyPath,
    ): EntityFormValidator {
        $entityFormValidator = new EntityFormValidator();

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->message;

        $pattern = substr($constraintAttribute->pattern, 1, strrpos($constraintAttribute->pattern, $constraintAttribute->pattern[0], -1) - 1);
        $pattern = str_replace('\\', '\\\\', $pattern);
        $entityFormValidator->rules = <<<JSEL
result = false;
if (currentValue || isString(currentValue)) {
    result = regexTest("$pattern", currentValue);
}
result
JSEL;

        return $entityFormValidator;
    }
}
