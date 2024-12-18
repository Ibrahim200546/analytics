<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service;

use Dexodus\EntityFormBundle\Attribute\EntityForm as EntityFormAttribute;
use Dexodus\EntityFormBundle\EntityForm;
use Dexodus\EntityFormBundle\Exception\NotFoundEntityFormException;
use Dexodus\TextCaseBundle\Enum\TextCaseEnum;
use Dexodus\TextCaseBundle\Service\WordsExtractor\WordsExtractor;
use Exception;
use ReflectionClass;

class EntityFormLoader implements EntityFormLoaderInterface
{
    /** @var EntityForm[] $entityForms */
    private array $entityForms = [];

    public function __construct(
        private readonly WordsExtractor $wordsExtractor,
    ) {
    }

    public function setEntityForms(array $entityFormClasses): void
    {
        foreach ($entityFormClasses as $entityFormClass) {
            $reflectionClass = new ReflectionClass($entityFormClass);
            $entityFormAttributes = $reflectionClass->getAttributes(EntityFormAttribute::class);

            foreach ($entityFormAttributes as $entityFormAttribute) {
                $entityForm = $this->createEntityForm(new $entityFormClass(), $entityFormAttribute->newInstance());

                if (array_key_exists($entityForm->name, $this->entityForms)) {
                    throw new Exception("Entity Form with name '$entityForm->name' has been duplicated");
                }

                $this->entityForms[$entityForm->name] = $entityForm;
            }
        }
    }

    public function createEntityForm(object $object, EntityFormAttribute $entityFormAttribute): EntityForm
    {
        $entityForm = new EntityForm();

        $entityForm->name = $entityFormAttribute->name ?? $this->convertClassToEntityFormName($object::class);
        $entityForm->entity = $entityFormAttribute->entity ?? $object::class;
        $entityForm->form = $object;
        $entityForm->attribute = $entityFormAttribute;

        return $entityForm;
    }

    public function get(string $entityFormName): EntityForm
    {
        if (!$this->has($entityFormName)) {
            throw new NotFoundEntityFormException($entityFormName, array_keys($this->entityForms));
        }

        return $this->entityForms[$entityFormName];
    }

    /** @return EntityForm[] */
    public function getAll(): array
    {
        return $this->entityForms;
    }

    public function convertClassToEntityFormName(string $class): string
    {
        $classParts = explode('\\', $class);
        $nameParts = [];

        foreach ($classParts as $classPart) {
            $nameParts[] = implode('-', $this->wordsExtractor->extract($classPart, TextCaseEnum::CAMEL_CASE));
        }

        return mb_strtolower(implode('.', $nameParts));
    }

    public function has(string $entityFormName): bool
    {
        return array_key_exists($entityFormName, $this->entityForms);
    }
}
