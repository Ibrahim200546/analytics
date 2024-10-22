<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Validator\Jsel;

use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\Unique;

#[Validator(Unique::class)]
class UniqueValidator implements ValidatorInterface
{
    public function __construct(
        private readonly RouterInterface $router,
    ) {
    }

    /**
     * @param Unique $constraintAttribute
     * @param string $entityClass
     * @param string $propertyPath
     * @return EntityFormValidator
     */
    public function generateRules(Constraint $constraintAttribute, string $entityClass, string $propertyPath): EntityFormValidator
    {
        $entityFormValidator = new EntityFormValidator();

        $propertyParts = explode('.', $propertyPath);
        $property = $propertyParts[count($propertyParts) - 1];

        $path = $this->router->generate('dexodus.entity_form.validator.is_unique', [
            'entityClass' => htmlspecialchars($entityClass),
            'property' => htmlspecialchars($property),
            'value' => '',
        ]);

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->message;
        $entityFormValidator->rules = "fetchJson(apiUrl + '$path/' + currentValue)";

        return $entityFormValidator;
    }
}
