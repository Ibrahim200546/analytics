<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\TrackedCurrency;
use App\Repository\TrackedCurrencyRepository;
use App\Service\CurrencyPairsUpdater;
use Exception;

class TrackedCurrencyProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private CurrencyPairsUpdater $currencyPairsUpdater,
        private TrackedCurrencyRepository $trackedCurrencyRepository,
    ) {
    }

    /** @param TrackedCurrency $data */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($operation instanceof Post) {
            $trackedCurrency = $this->trackedCurrencyRepository->findOneBy(['currencyCode' => $data->currencyCode]);

            if ($trackedCurrency instanceof TrackedCurrency) {
                throw new Exception("Currency $trackedCurrency->currencyCode already tracking");
            }

            $this->currencyPairsUpdater->createAllCurrencyPairs($data);
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
