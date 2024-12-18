<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Service;

use Dexodus\TranslationApiBundle\Dto\LocaleList;
use Dexodus\TranslationApiBundle\Dto\TranslationList;
use Dexodus\TranslationApiBundle\Dto\TranslationUnit;
use Dexodus\TranslationApiBundle\Repository\LocaleRepository;
use Dexodus\TranslationApiBundle\Repository\TranslationUnitRepository;

class TranslationListGenerator
{
    public function __construct(
        private TranslationUnitRepository $translationUnitRepository,
        private LocaleRepository $localeRepository,
    ) {
    }

    public function getList(string $locale): TranslationList
    {
        $translationUnits = $this->translationUnitRepository->findAllByLocale($locale);
        $translationList = new TranslationList();
        $translationList->locale = $locale;

        foreach ($translationUnits as $translationUnit) {
            $translationUnitDto = new TranslationUnit();
            $translationUnitDto->value = $translationUnit->value;
            $translationUnitDto->key = $translationUnit->translation->key;
            $translationList->translations->add($translationUnitDto);
        }

        return $translationList;
    }

    public function getLocales(): LocaleList
    {
        $localeList = new LocaleList();

        foreach ($this->localeRepository->findAll() as $locale) {
            $localeList->locales->add($locale->locale);
        }

        return $localeList;
    }
}
