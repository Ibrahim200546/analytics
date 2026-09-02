<?php

declare(strict_types=1);

namespace Dexodus\InstagramParserBundle\Command;

use Dexodus\WebResourceBundle\Service\HttpClient;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DomCrawler\Crawler;

#[AsCommand('instagram:test')]
class TestCommand extends Command
{
    public function __construct(
        private HttpClient $httpClient,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $a = $this->fetchInstagramPosts('kazakh_inform');

        return Command::SUCCESS;
    }

    private function fetchInstagramPosts($username)
    {
        $userAgent = '';
        $xIgAppId = '';

        $html = $this->httpClient->getHtml("https://www.instagram.com/{$username}/", true);

        $crawler = new Crawler($html);
    }
}
