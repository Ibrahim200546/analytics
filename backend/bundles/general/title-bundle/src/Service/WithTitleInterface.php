<?php

declare(strict_types=1);

namespace Dexodus\TitleBundle\Service;

interface WithTitleInterface
{
    public function getTitle(): string;
}
