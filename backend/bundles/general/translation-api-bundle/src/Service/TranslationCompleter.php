<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Service;

use Dexodus\TranslationApiBundle\Entity\Translation;
use Dexodus\TranslationApiBundle\Entity\TranslationUnit;
use Dexodus\TranslationApiBundle\Enum\TranslationCreationTypeEnum;
use Dexodus\TranslationApiBundle\Exception\LocaleNotFoundedException;
use Dexodus\TranslationApiBundle\Repository\LocaleRepository;
use Dexodus\TranslationApiBundle\Repository\TranslationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class TranslationCompleter
{
    public function __construct(
        private LocaleRepository $localeRepository,
        private TranslationRepository $translationRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function complete(string $locale, array $translations): void
    {
        $localeEntity = $this->localeRepository->findOneByLocale($locale);

        if (is_null($localeEntity)) {
            throw new LocaleNotFoundedException($locale);
        }

        foreach ($translations as $key => $value) {
            $translation = $this->translationRepository->findOneByKey($key);

            if (is_null($translation)) {
                $translation = new Translation();
                $translation->key = $key;
                $translation->creationType = TranslationCreationTypeEnum::AUTOMATIC;
                $this->entityManager->persist($translation);
            }

            $translationUnit = null;

            foreach ($translation->units as $unit) {
                if ($unit->locale === $localeEntity) {
                    $translationUnit = $unit;
                    break;
                }
            }

            if (is_null($translationUnit)) {
                $translationUnit = new TranslationUnit();
                $translationUnit->locale = $localeEntity;
                $translation->addUnit($translationUnit);
                $this->entityManager->persist($translationUnit);
            }

            $translationUnit->value = $value;
        }

        $this->entityManager->flush();
    }
}
