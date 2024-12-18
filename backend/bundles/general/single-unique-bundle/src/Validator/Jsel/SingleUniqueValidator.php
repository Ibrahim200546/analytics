<?php

declare(strict_types=1);

namespace Dexodus\SingleUniqueBundle\Validator\Jsel;

use Dexodus\EntityFormBundle\Attribute\Validator;
use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Enum\ValidatorTypeEnum;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use Dexodus\SingleUniqueBundle\Attribute\SingleUnique;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Validator\Constraint;

#[Validator(SingleUnique::class)]
class SingleUniqueValidator implements ValidatorInterface
{
    public function __construct(
        private readonly RouterInterface $router,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param SingleUnique $constraintAttribute
     * @param string $entityClass
     * @param string $propertyPath
     * @return EntityFormValidator
     */
    public function generateRules(Constraint $constraintAttribute, string $entityClass, string $propertyPath): EntityFormValidator
    {
        $entityFormValidator = new EntityFormValidator();

        $propertyParts = explode('.', $propertyPath);
        $property = $propertyParts[count($propertyParts) - 1];


        $path = $this->router->generate('dexodus.single_unique.validator.is_unique', [
            'entityClass' => htmlspecialchars($entityClass),
            'property' => htmlspecialchars($property),
            'value' => '',
        ]);

        $meta = $this->entityManager->getClassMetadata($entityClass);
        $identifier = $meta->getSingleIdentifierFieldName();

        $entityFormValidator->type = ValidatorTypeEnum::JSEL;
        $entityFormValidator->errorMessage = $constraintAttribute->message;
        $entityFormValidator->rules = "fetchJson(apiUrl + '$path/' + currentValue + '?entityId=' + data.$identifier)";

        return $entityFormValidator;
    }
}
