<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Command;

use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('article:parse-new')]
class ParseNewArticlesCommand extends Command
{
    public function __construct(
        private GlobalSmiParser $globalSmiParser,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function configure()
    {
        $this->addArgument('parsers', InputArgument::IS_ARRAY, 'Парсеры', $this->globalSmiParser->getParserNames());
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $parsers = $input->getArgument('parsers');

        if (!($output instanceof ConsoleOutputInterface)) {
            $output->writeln('<error>Консоль не поддерживает секционный вывод текста</error>');
            return Command::FAILURE;
        }

        $this->globalSmiParser->parseNewArticles($output, $parsers);

        return Command::SUCCESS;
    }
}
