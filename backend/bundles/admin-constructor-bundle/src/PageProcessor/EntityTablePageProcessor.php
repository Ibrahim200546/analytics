<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\PageProcessor;

use Dexodus\AdminConstructorBundle\Attribute\PageProcessor;
use Dexodus\AdminConstructorBundle\Dto\EntityTablePage;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\EntityTableBundle\Attribute\EntityTable as EntityTableAttribute;
use Dexodus\EntityTableBundle\Service\EntityTableLoaderInterface;
use Exception;
use ReflectionClass;

#[PageProcessor(EntityTablePage::class)]
class EntityTablePageProcessor implements PageProcessorInterface
{
    public function __construct(
        private EntityTableLoaderInterface $entityTableLoader,
    ) {
    }

    /**
     * @param EntityTablePage $page
     */
    public function processPage(PageInterface $page): EntityTablePage
    {
        if (class_exists($page->name)) {
            $entityReflection = new ReflectionClass($page->name);
            $attributes = $entityReflection->getAttributes(EntityTableAttribute::class);

            if (count($attributes) !== 1) {
                $entityFormAttributeClass = EntityTableAttribute::class;

                throw new Exception(
                    "Expected only one attribute '$entityFormAttributeClass' for class '{$page->name}'",
                );
            }

            /** @var EntityTableAttribute $entityFormAttribute */
            $entityFormAttribute = $attributes[0]->newInstance();
            $page->name = $entityFormAttribute->name ?? $this->entityTableLoader->convertClassToEntityFormName($page->name);
        }

        $this->entityTableLoader->get($page->name);

        return $page;
    }
}
