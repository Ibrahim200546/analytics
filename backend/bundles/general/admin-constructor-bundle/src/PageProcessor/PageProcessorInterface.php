<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\PageProcessor;

use Dexodus\AdminConstructorBundle\Dto\PageInterface;

interface PageProcessorInterface
{
    public function processPage(PageInterface $page): PageInterface;
}
