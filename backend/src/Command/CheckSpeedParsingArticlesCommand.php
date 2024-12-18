<?php

declare(strict_types=1);

namespace App\Command;

use Dexodus\SmiParserInterface\Repository\ArticleRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('check-speed-parsing-articles')]
class CheckSpeedParsingArticlesCommand extends Command
{
    public function __construct(
        private ArticleRepository $articleRepository,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        return Command::SUCCESS;
    }
}
