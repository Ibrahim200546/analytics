<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Command;

use Dexodus\WebResourceBundle\Service\Browser;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('test:browser')]
class TestBrowserCommand extends Command
{
    public function __construct(
        private Browser $browser,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->browser->exec('');

        return Command::SUCCESS;
    }
}
