<?php

declare(strict_types=1);

namespace App\Command;

use Dexodus\TengrinewsApiBundle\Service\RuSentiment;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('test')]
class TestCommand extends Command
{
    public function __construct(
        private RuSentiment $ruSentiment,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $a = $this->ruSentiment->analyze('Этот фильм был невероятно скучным и долгим.');

        return Command::SUCCESS;
    }
}
