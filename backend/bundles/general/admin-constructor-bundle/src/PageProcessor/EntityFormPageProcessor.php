<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\PageProcessor;

use Dexodus\AdminConstructorBundle\Attribute\PageProcessor;
use Dexodus\AdminConstructorBundle\Dto\EntityFormPage;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\EntityFormBundle\Attribute\EntityForm as EntityFormAttribute;
use Dexodus\EntityFormBundle\Service\EntityFormLoaderInterface;
use Exception;
use ReflectionClass;

#[PageProcessor(EntityFormPage::class)]
class EntityFormPageProcessor implements PageProcessorInterface
{
    public function __construct(
        private EntityFormLoaderInterface $entityFormLoader,
    ) {
    }

    /**
     * @param EntityFormPage $page
     */
    public function processPage(PageInterface $page): EntityFormPage
    {
        if (class_exists($page->name)) {
            $entityReflection = new ReflectionClass($page->name);
            $attributes = $entityReflection->getAttributes(EntityFormAttribute::class);

            if (count($attributes) !== 1) {
                $entityFormAttributeClass = EntityFormAttribute::class;

                throw new Exception(
                    "Expected only one attribute '$entityFormAttributeClass' for class '{$page->name}'",
                );
            }

            /** @var EntityFormAttribute $entityFormAttribute */
            $entityFormAttribute = $attributes[0]->newInstance();
            $page->name = $entityFormAttribute->name ?? $this->entityFormLoader->convertClassToEntityFormName($page->name);
        }

        $this->entityFormLoader->get($page->name);

        return $page;
    }
}
