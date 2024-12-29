<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use DateTimeImmutable;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Dexodus\SmiParserBundle\Repository\ArticleRepository;
use Dexodus\SmiParserBundle\Service\SmiParserInterface;
use Dexodus\WebResourceBundle\Entity\WebResource;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticle;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticleList;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
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
    ) {
    }

    public function parseNewArticles(ConsoleOutputInterface $output): void
    {
        $webResourceSection = $output->section();
        $webResourceSection->writeln('<info>Обработка веб ресурсов...</info>');

        foreach ($this->webResourceRepository->findAll() as $webResource) {
            $section = $output->section();
            $progressBarSection = $output->section();
            $section->writeln("<info>Обработка веб-ресурса <comment>$webResource->name</comment>...</info>");

            $countArticleLists = $this->getCountArticleList($webResource);
            $progressBar = new ProgressBar($progressBarSection, $countArticleLists);
            $section->overwrite("<info>Добавление новостных страниц веб-ресурса <comment>$webResource->name</comment> в очередь...</info>");
            $countAdded = 0;

            for ($page = 1; $page <= $countArticleLists; $page++) {
                $progressBar->setProgress($page);
                $articleListUrl = $this->webResourceUrlManager->buildUrlByPattern($webResource->articlesPathPattern, ['page' => $page]);
                $articleListCrawler = $this->httpClient->getCrawlerFromUrl($articleListUrl);
                $aElements = $articleListCrawler->filter($webResource->containerCssPath . ' ' . $webResource->articleLinkCssPath);
                $articleAlreadyExists = false;

                foreach ($aElements as $index => $aElement) {
                    $href = $aElement->attributes->getNamedItem('href')->nodeValue;

                    if (is_null($href)) {
                        continue;
                    }

                    $extendedHref = $this->webResourceUrlManager->extendUrl($webResource, $href);
                    $article = null;

                    if ($countAdded % 100 === 0) {
                        $article = $this->processArticle($webResource, $extendedHref);
                    }

                    if (is_null($this->articleRepository->findOneBy(['originalPath' => $extendedHref])) && (!$article || $article->createdAt >= $webResource->parseToDate)) {
                        $countAdded++;
                        $this->messageBus->dispatch(new WebResourceRawArticle($webResource->id, $extendedHref));
                    } else {
                        $articleAlreadyExists = true;
                        break;
                    }
                }

                if ($articleAlreadyExists) {
                    break;
                }
            }

            $progressBar->finish();
            $progressBarSection->clear();
            $section->overwrite("<info>Добавлено <comment>$countAdded</comment> из <comment>$countArticleLists</comment> новостных страниц веб-ресурса <comment>$webResource->name</comment> в очередь</info>");
        }

        $webResourceSection->overwrite('<info>Обработка веб ресурсов завершена</info>');
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

    public function getSourceFavicon(Article $article): string
    {
        return $this->webResourceRepository->findOneBy(['name' => $article->source])->faviconUrl;
    }

    public function getSourceName(Article $article): string
    {
        return $article->source;
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

    protected function getCountArticleList(WebResource $webResource): int
    {
        $firstArticleListUrl = $this->webResourceUrlManager->buildUrlByPattern($webResource->articlesPathPattern, ['page' => 1]);
        $articleListCrawler = $this->httpClient->getCrawlerFromUrl($firstArticleListUrl);

        $maxPage = 1;

        foreach ($articleListCrawler->filter('a') as $aElement) {
            $href = $aElement->attributes->getNamedItem('href')->nodeValue;

            if (is_null($href)) {
                continue;
            }

            $extendedHref = $this->webResourceUrlManager->extendUrl($webResource, $href);
            $options = $this->webResourceUrlManager->extractOptionsFromUrl($webResource->articlesPathPattern, $extendedHref);

            if (is_null($options) || !is_numeric($options['page'])) {
                continue;
            }

            $maxPage = max($maxPage, (int) $options['page']);
        }

        return $maxPage;
    }

    public function getSourceLink(Article $article): string
    {
        return $article->originalPath;
    }

    public function replyComment(ArticleComment $articleComment, string $comment, ParserAccountInterface $parserAccount): string | false
    {
        return false;
    }
}
