<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\Controller;

use Dexodus\TranslationApiBundle\Service\TranslationCompleter;
use Dexodus\TranslationApiBundle\Service\TranslationListGenerator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class TranslationController
{
    public function __construct(
        private TranslationListGenerator $translationListGenerator,
        private TranslationCompleter     $translationCompleter,
        private SerializerInterface      $serializer,
    )
    {
    }

    #[Route('/translation-api/list/{locale}', name: 'translation_api.translations.list')]
    public function getTranslations(string $locale): Response
    {
        $result = $this->serializer->serialize($this->translationListGenerator->getList($locale), 'json');

        return new Response($result, 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/translation-api/complete/{locale}', methods: ['POST'])]
    public function createTranslations(Request $request, string $locale): Response
    {
        $translations = json_decode($request->getContent(), true);
        $this->translationCompleter->complete($locale, $translations);

        return new Response();
    }

    #[Route('/translation-api/locales', methods: ['GET'])]
    public function getLocales(): Response
    {
        $result = $this->serializer->serialize($this->translationListGenerator->getLocales(), 'json');

        return new Response($result, 200, ['Content-Type' => 'application/json']);
    }
}
