<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Exception;

use Exception;

class LocaleNotFoundedException extends Exception
{
    public function __construct(string $locale)
    {
        parent::__construct("Locale '$locale' not founded");
    }
}
