<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\ProjectArticle;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\TypescriptTypesBundle\Attribute\AsTSType;
use Symfony\Component\Serializer\Attribute\Groups;

#[AsTSType(groups: [ProjectArticle::ROLE_VIEW, Article::GROUP_VIEW, ArticleComment::ROLE_VIEW])]
class ProjectArticleView
{
    #[Groups([ProjectArticle::ROLE_VIEW])]
    public string $sourceFavicon;

    #[Groups([ProjectArticle::ROLE_VIEW])]
    public string $sourceName;

    #[Groups([ProjectArticle::ROLE_VIEW])]
    public ProjectArticle $projectArticle;

    #[Groups([ProjectArticle::ROLE_VIEW])]
    public string $sourceLink;
}
