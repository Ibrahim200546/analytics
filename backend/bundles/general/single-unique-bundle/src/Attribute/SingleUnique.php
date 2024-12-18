<?php

declare(strict_types=1);

namespace Dexodus\SingleUniqueBundle\Attribute;

use Attribute;
use Dexodus\SingleUniqueBundle\Validator\SingleUniqueValidator;
use Symfony\Component\Validator\Constraint;

#[Attribute]
class SingleUnique extends Constraint
{
    public function __construct(
        public readonly string $message,
        ?array $groups = null,
        mixed $payload = null
    ) {
        parent::__construct([], $groups, $payload);
    }

    public function validatedBy(): string
    {
        return SingleUniqueValidator::class;
    }
}
