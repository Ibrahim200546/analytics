<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Dexodus\WebResourceBundle\Dto\ArticleCommentsStructure;
use Dexodus\WebResourceBundle\Entity\WebResource;
use Dexodus\WebResourceBundle\Service\ArticleCommentsStructureGenerator;
use Dexodus\WebResourceBundle\Service\ArticleListStructureGenerator;
use Dexodus\WebResourceBundle\Service\ArticleStructureGenerator;
use Dexodus\WebResourceBundle\Service\HttpClient;
use Dexodus\WebResourceBundle\Service\WebResourcePaginator;
use Dexodus\WebResourceBundle\Service\WebResourceUrlManager;

class WebResourceProcessor implements ProcessorInterface
{
    public function __construct(
        private ArticleListStructureGenerator $articleListStructureGenerator,
        private ArticleStructureGenerator $articleStructureGenerator,
        private ArticleCommentsStructureGenerator $articleCommentsStructureGenerator,
        private WebResourcePaginator $webResourcePaginator,
        private PersistProcessor $persistProcessor,
        private WebResourceUrlManager $webResourceUrlManager,
        private HttpClient $httpClient,
    ) {
    }

    /**
     * @param WebResource $data
     * @param Operation $operation
     * @param array $uriVariables
     * @param array $context
     * @return void
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $articleListStructure = $this->articleListStructureGenerator->generate($data->listArticlesLink);

        $data->articleLinkCssPath = $articleListStructure->articleLinkCssPath;
        $data->containerCssPath = $articleListStructure->containerCssPath;
        $data->articlesPathPattern = $articleListStructure->articlesPathPattern;

        $articleLinks = $this->webResourcePaginator->getLinksFromOnePageWebResource($data->listArticlesLink, $data);

        $articleStructure = $this->articleStructureGenerator->generate($articleLinks[0]);
        $data->titleCssPath = $articleStructure->titleCssPath;
        $data->announceCssPath = $articleStructure->announceCssPath;
        $data->contentCssPath = $articleStructure->contentCssPath;
        $data->createdAtCssPath = $articleStructure->createdAtCssPath;
        $data->imageCssPath = $articleStructure->imageCssPath;
        $data->createdAtFormat = $articleStructure->createdAtFormat;
        $articleCommentsStructure = new ArticleCommentsStructure();

        foreach (array_reverse($articleLinks) as $articleLink) {
            $articleCommentsStructure = $this->articleCommentsStructureGenerator->generate($articleLink);

            if ($articleCommentsStructure->commentsContainerCssPath === '') {
                continue;
            }

            if ($articleCommentsStructure->commentContainerCssPath === '') {
                continue;
            }

            break;
        }

        $crawler = $this->httpClient->getCrawlerFromUrl($articleLink);
        $data->faviconUrl = $this->webResourceUrlManager->extendUrl($data, $crawler->filter('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')->first()->attr('href'));

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
