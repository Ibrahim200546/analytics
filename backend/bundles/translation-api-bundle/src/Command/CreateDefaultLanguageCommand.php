<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Command;

use Dexodus\TranslationApiBundle\Entity\Locale;
use Dexodus\TranslationApiBundle\Entity\Translation;
use Dexodus\TranslationApiBundle\Entity\TranslationUnit;
use Dexodus\TranslationApiBundle\Enum\TranslationCreationTypeEnum;
use Dexodus\TranslationApiBundle\Repository\LocaleRepository;
use Dexodus\TranslationApiBundle\Repository\TranslationRepository;
use Dexodus\TranslationApiBundle\Repository\TranslationUnitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('translation:locale:create-default')]
class CreateDefaultLanguageCommand extends Command
{
    public function __construct(
        private LocaleRepository $localeRepository,
        private TranslationRepository $translationRepository,
        private TranslationUnitRepository $translationUnitRepository,
        private EntityManagerInterface $entityManager,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $defaultLanguage = 'ru';
        $locale = $this->localeRepository->findOneBy(['locale' => $defaultLanguage]);

        if (is_null($locale)) {
            $locale = new Locale();
            $locale->locale = $defaultLanguage;
            $this->entityManager->persist($locale);
        }

        $translationUnit = $this->translationUnitRepository->findOneBy(['locale' => $locale, 'value' => $defaultLanguage]);

        if (is_null($translationUnit)) {
            $translationUnit = new TranslationUnit();
            $translationUnit->locale = $locale;
            $translationUnit->value = $defaultLanguage;
            $this->entityManager->persist($translationUnit);
        }

        $translation = $this->translationRepository->findOneBy(['key' => $defaultLanguage]);

        if (is_null($translation)) {
            $translation = new Translation();
            $translation->key = $defaultLanguage;
            $translation->creationType = TranslationCreationTypeEnum::AUTOMATIC;
            $this->entityManager->persist($translation);
        }

        if (!$translation->getUnits()->contains($translationUnit)) {
            $translation->addUnit($translationUnit);
        }

        $locale->translation = $translation;

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
