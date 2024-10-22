<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\CurrencyPairsUpdater;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('currency:pairs:update')]
class UpdateCurrencyPairsCommand extends Command
{
    public function __construct(
        private CurrencyPairsUpdater $currencyPairsUpdater,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->currencyPairsUpdater->updateAll();

        return Command::SUCCESS;
    }
}
