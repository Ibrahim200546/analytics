<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Service;

use Dexodus\TranslationApiBundle\Entity\TranslationUnit;
use Dexodus\TranslationApiBundle\Repository\TranslationUnitRepository;

class TranslateService
{
    public function __construct(
        private readonly TranslationUnitRepository $translationUnitRepository,
    ) {
    }

    public function translate(string $key, string $locale): ?string
    {
        $translationUnit = $this->translationUnitRepository->findOneByKeyAndLocale($key, $locale);

        if (!$translationUnit instanceof TranslationUnit) {
            return null;
        }

        return $translationUnit->value;
    }
}
