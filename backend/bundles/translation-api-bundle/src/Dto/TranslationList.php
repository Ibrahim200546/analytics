<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Dto;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class TranslationList
{
    public string $locale;

    /** @var Collection<int, TranslationUnit> */
    public Collection $translations;

    public function __construct()
    {
        $this->translations = new ArrayCollection();
    }
}
