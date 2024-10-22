<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\Dto\EntityFormValidator;
use Dexodus\EntityFormBundle\Validator\ValidatorInterface;
use ReflectionProperty;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;

class ValidatorExtractor
{
    /** @var ValidatorInterface[] */
    private array $validators;

    public function __construct(
        private PropertyAccessorInterface $propertyAccessor,
    ) {
    }

    public function setValidators(array $validators): void
    {
        $this->validators = $validators;
    }

    /** @return EntityFormValidator[] */
    public function extractForProperty(string $class, string $property, string $propertyPath, array $groups = []): array
    {
        $reflectionProperty = new ReflectionProperty($class, $property);
        $validators = [];

        foreach ($reflectionProperty->getAttributes() as $attribute) {
            $validator = $this->getValidatorForAttribute($attribute->getName());

            if (is_null($validator)) {
                continue;
            }

            $attributeInstance = $attribute->newInstance();

            if ($this->propertyAccessor->isReadable($attributeInstance, 'groups')) {
                $attributeGroups = $this->propertyAccessor->getValue($attributeInstance, 'groups');

                if (is_string($attributeGroups)) {
                    $attributeGroups = [$attributeGroups];
                }

                if (!is_array($attributeGroups)) {
                    $attributeGroups = ['Default'];
                }

                if (empty(array_intersect([...$groups, 'Default'], $attributeGroups))) {
                    continue;
                }
            }

            $validators[] = $validator->generateRules($attributeInstance, $class, $propertyPath);
        }

        return $validators;
    }

    public function getValidatorForAttribute(string $attributeClass): ?ValidatorInterface
    {
        if (array_key_exists($attributeClass, $this->validators)) {
            return $this->validators[$attributeClass];
        }

        return null;
    }
}
