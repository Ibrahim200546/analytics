<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Command;

use Dexodus\WebResourceBundle\Entity\WebResource;
use Dexodus\WebResourceBundle\Message\WebResourceRawArticleList;
use Dexodus\WebResourceBundle\Repository\WebResourceRepository;
use Dexodus\WebResourceBundle\Service\HttpClient;
use Dexodus\WebResourceBundle\Service\WebResourceUrlManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand('web-resource:parse')]
class ParseCommand extends Command
{
    public function __construct(
        private WebResourceRepository $webResourceRepository,
        private WebResourceUrlManager $webResourceUrlManager,
        private HttpClient $httpClient,
        private MessageBusInterface $messageBus,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        if (!($output instanceof ConsoleOutputInterface)) {
            $output->writeln('<error>Консоль не поддерживает секционный вывод текста</error>');
            return Command::FAILURE;
        }

        foreach ($this->webResourceRepository->findAll() as $webResource) {
            if ($webResource->id !== 7) {
                continue;
            }

            $section = $output->section();
            $progressBarSection = $output->section();
            $section->writeln("<info>Обработка веб-ресурса <comment>$webResource->name</comment>...</info>");

            $countArticleLists = $this->getCountArticleList($webResource);
            $progressBar = new ProgressBar($progressBarSection, $countArticleLists);
            $section->overwrite("<info>Добавление новостных страниц веб-ресурса <comment>$webResource->name</comment> в очередь...</info>");

            for ($page = 1; $page <= $countArticleLists; $page++) {
                $progressBar->setProgress($page);
                $articleListUrl = $this->webResourceUrlManager->buildUrlByPattern($webResource->articlesPathPattern, ['page' => $page]);
                $this->messageBus->dispatch(new WebResourceRawArticleList($webResource->id, $articleListUrl));
            }

            $progressBar->finish();
            $progressBarSection->clear();
            $section->overwrite("<info>Добавлено <comment>$countArticleLists</comment> новостных страниц веб-ресурса <comment>$webResource->name</comment> в очередь</info>");
        }

        return Command::SUCCESS;
    }

    private function getCountArticleList(WebResource $webResource): int
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
}
