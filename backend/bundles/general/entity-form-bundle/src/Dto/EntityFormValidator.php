<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Dto;

use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;

class EntityFormValidator
{
    public ValidatorTypeEnum $type;

    public string $errorMessage;

    public mixed $rules;
}
