<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\MessageHandler;

use Dexodus\WebResourceBundle\Message\WebResourceRawArticle;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticleList;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Dexodus\WebResourceBundle\Service\HttpClient;
use Dexodus\WebResourceBundle\Service\WebResourceUrlManager;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsMessageHandler]
class WebResourceRawArticleListHandler
{
    public function __construct(
        private WebResourceRepository $webResourceRepository,
        private HttpClient $httpClient,
        private MessageBusInterface $messageBus,
        private WebResourceUrlManager $webResourceUrlManager,
    ) {
    }

    public function __invoke(WebResourceRawArticleList $webResourceRawArticleList)
    {
        $webResource = $this->webResourceRepository->find($webResourceRawArticleList->webResourceId);
        $articleListCrawler = $this->httpClient->getCrawlerFromUrl($webResourceRawArticleList->listUrl);
        $aElements = $articleListCrawler->filter($webResource->containerCssPath . ' ' . $webResource->articleLinkCssPath);

        foreach ($aElements as $aElement) {
            $href = $aElement->attributes->getNamedItem('href')->nodeValue;

            if (is_null($href)) {
                continue;
            }

            $extendedHref = $this->webResourceUrlManager->extendUrl($webResource, $href);
            $this->messageBus->dispatch(new WebResourceRawArticle($webResource->id, $extendedHref));
        }
    }
}
