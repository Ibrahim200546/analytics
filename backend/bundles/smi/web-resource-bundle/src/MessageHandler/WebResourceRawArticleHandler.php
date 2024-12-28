<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\MessageHandler;

use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticle;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Dexodus\WebResourceBundle\Service\WebResourceParser;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class WebResourceRawArticleHandler
{
    public function __construct(
        private WebResourceRepository $webResourceRepository,
        private WebResourceParser $webResourceParser,
        private EntityManagerInterface $entityManager,
        private GlobalSmiParser $globalSmiParser,
    ) {
    }

    public function __invoke(WebResourceRawArticle $webResourceRawArticle)
    {
        $webResource = $this->webResourceRepository->find($webResourceRawArticle->webResourceId);
        $article = $this->webResourceParser->processArticle($webResource, $webResourceRawArticle->articleUrl);
        $this->globalSmiParser->parseComments($article);
        $this->entityManager->persist($article);
        $this->entityManager->flush();
    }
}
