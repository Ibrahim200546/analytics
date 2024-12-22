<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use DateTimeImmutable;
use Dexodus\SmiParserInterface\Entity\Article;
use Dexodus\SmiParserInterface\Entity\ArticleComment;
use Dexodus\SmiParserInterface\Repository\ArticleRepository;
use Dexodus\SmiParserInterface\Service\SmiParserInterface;
use Dexodus\WebResourceBundle\Entity\WebResource;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticle;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Messenger\MessageBusInterface;

class WebResourceParser implements SmiParserInterface
{
    public function __construct(
        private HttpClient $httpClient,
        private HtmlUsefulBodyExtractor $htmlUsefulBodyExtractor,
        private ArticleRepository $articleRepository,
        private WebResourceUrlManager $webResourceUrlManager,
        private MessageBusInterface $messageBus,
        private WebResourceRepository $webResourceRepository,
        private WebResourceDateTimeParser $webResourceDateTimeParser,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function processArticle(WebResource $webResource, string $articleUrl): Article
    {
        $crawler = $this->httpClient->getCrawlerFromUrl($articleUrl);
        $article = $this->articleRepository->findOneBy(['originalPath' => $articleUrl, 'parser' => $this->getParserName(), 'source' => $webResource->name]);

        if (is_null($article)) {
            $article = new Article();
            $article->originalPath = $articleUrl;
            $article->source = $webResource->name;
            $article->parser = $this->getParserName();
        }

        $article->isScheduledForUpdate = false;
        $article->lastUpdate = new DateTimeImmutable();
        $this->parseComments($article, $crawler, $webResource);

        return $this->parseGeneralInformation($article, $crawler, $webResource);
    }

    public function parse(Article $article): void
    {
        $webResource = $this->webResourceRepository->findOneBy(['name' => $article->source]);
        $this->messageBus->dispatch(new WebResourceRawArticle($webResource->id, $article->originalPath));
    }

    public function getParserName(): string
    {
        return 'WebResource';
    }

    protected function parseComments(Article $article, Crawler $crawler, WebResource $webResource): Article
    {
        $commentsCrawler = $crawler->filter($webResource->commentsContainerCssPath . ' ' . $webResource->commentContainerCssPath);

        foreach ($commentsCrawler as $commentNode) {
            $commentCrawler = new Crawler($commentNode);

            $articleComment = new ArticleComment();
            $articleComment->commentatorName = $commentCrawler->filter($webResource->commentCommentatorNameCssPath)->text();
            $articleComment->createdAtString = $commentCrawler->filter($webResource->commentCreatedAtCssPath)->text();
            $articleComment->content = $commentCrawler->filter($webResource->commentContentCssPath)->text();
            try {
                $articleComment->likes = (int) $commentCrawler->filter($webResource->commentLikesCssPath)->text();
                $articleComment->dislikes = (int) $commentCrawler->filter($webResource->commentDislikesCssPath)->text();
            } catch (Exception) {
            }
            $article->comments->add($articleComment);
            $articleComment->article = $article;
            $this->entityManager->persist($articleComment);
        }

        return $article;
    }

    protected function parseGeneralInformation(Article $article, Crawler $crawler, WebResource $webResource): Article
    {
        $article->content = $this->htmlUsefulBodyExtractor->extract(new Crawler($crawler->filter($webResource->contentCssPath)->html()));
        $article->title = $crawler->filter($webResource->titleCssPath)->text();

        if (!is_null($webResource->announceCssPath)) {
            $article->announce = $crawler->filter($webResource->announceCssPath)->text();
        }

        if (!is_null($webResource->imageCssPath) && !is_null($imageNode = $crawler->filter($webResource->imageCssPath)->getNode(0))) {
            $article->imageUrl = $this->webResourceUrlManager->extendUrl($webResource, $imageNode->attributes->getNamedItem('src')->nodeValue);
        }

        if (!is_null($webResource->createdAtCssPath) && !is_null($webResource->createdAtFormat) && !is_null($createdAtNode = $crawler->filter($webResource->createdAtCssPath)->getNode(0))) {
            $createdAtString = $createdAtNode->textContent;
            $article->createdAt = $this->webResourceDateTimeParser->parse($createdAtString, $webResource->createdAtFormat, 'Asia/Almaty');
        }

        return $article;
    }
}
