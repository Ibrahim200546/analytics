<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Dto\ProjectArticleView;
use App\Repository\ProjectArticleRepository;
use Dexodus\SmiParserBundle\Service\GlobalSmiParser;

class ViewProjectArticleProvider implements ProviderInterface
{
    public function __construct(
        private ProjectArticleRepository $projectArticleRepository,
        private GlobalSmiParser $globalSmiParser,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $projectArticle = $this->projectArticleRepository->find($uriVariables['id']);
        $projectArticleView = new ProjectArticleView();
        $projectArticleView->projectArticle = $projectArticle;

        $projectArticleView->sourceFavicon = $this->globalSmiParser->getSourceFavicon($projectArticle->article);
        $projectArticleView->sourceName = $this->globalSmiParser->getSourceName($projectArticle->article);
        $projectArticleView->sourceLink = $this->globalSmiParser->getSourceLink($projectArticle->article);

        return $projectArticleView;
    }
}
