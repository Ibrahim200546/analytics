<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Dto;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class LocaleList
{
    /** @var Collection<int, string> */
    public Collection $locales;

    public function __construct()
    {
        $this->locales = new ArrayCollection();
    }
}
