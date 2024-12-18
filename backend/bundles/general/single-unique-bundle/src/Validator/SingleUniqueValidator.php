<?php

declare(strict_types=1);

namespace Dexodus\SingleUniqueBundle\Validator;

use Dexodus\SingleUniqueBundle\Attribute\SingleUnique;
use Dexodus\SingleUniqueBundle\Service\UniqueChecker;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class SingleUniqueValidator extends ConstraintValidator
{
    public function __construct(
        private UniqueChecker $uniqueChecker,
        private EntityManagerInterface $entityManager,
        private PropertyAccessorInterface $propertyAccessor,
    ) {
    }

    /**
     * @param mixed $value
     * @param SingleUnique $constraint
     * @return void
     */
    public function validate(mixed $value, Constraint $constraint)
    {
        if ($value === null) {
            return;
        }

        $root = $this->context->getObject();
        $propertyName = $this->context->getPropertyName();
        $id = null;

        if ($this->entityManager->getUnitOfWork()->isInIdentityMap($root)) {
            $meta = $this->entityManager->getClassMetadata($root::class);
            $identifier = $meta->getSingleIdentifierFieldName();
            $id = $this->propertyAccessor->getValue($root, $identifier);
        }

        if ($this->uniqueChecker->isUnique($root::class, $propertyName, $value, $id)) {
            return;
        }

        $this->context->addViolation($constraint->message);
    }
}
