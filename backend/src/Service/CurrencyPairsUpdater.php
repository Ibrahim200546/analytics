<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\CurrencyPair;
use App\Entity\TrackedCurrency;
use App\Repository\TrackedCurrencyRepository;
use DateTimeImmutable;
use Dexodus\FreeCurrencyApiBundle\Service\FreeCurrencyApi;
use Doctrine\ORM\EntityManagerInterface;

class CurrencyPairsUpdater
{
    public function __construct(
        private FreeCurrencyApi $freeCurrencyApi,
        private TrackedCurrencyRepository $trackedCurrencyRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function updateAll()
    {
        $trackedCurrencies = [];

        foreach ($this->trackedCurrencyRepository->findAll() as $trackedCurrency) {
            $trackedCurrencies[$trackedCurrency->currencyCode->value] = $trackedCurrency;
        }

        $trackedCurrenciesCodes = array_keys($trackedCurrencies);

        foreach ($trackedCurrencies as $currencyCode => $trackedCurrency) {
            $otherCurrenciesCodes = array_diff($trackedCurrenciesCodes, [$currencyCode]);
            $latestExchangeResponse = $this->freeCurrencyApi->latestExchange($currencyCode, $otherCurrenciesCodes);

            foreach ($trackedCurrency->buyCurrencyPairs as $buyCurrencyPair) {
                $buyCurrencyPair->disable();
            }

            foreach ($otherCurrenciesCodes as $otherCurrenciesCode) {
                $this->createCurrencyPair(
                    $trackedCurrency,
                    $trackedCurrencies[$otherCurrenciesCode],
                    $latestExchangeResponse->getExchange($otherCurrenciesCode),
                );
            }

            $trackedCurrency->latestUpdate = new DateTimeImmutable();
        }

        $this->entityManager->flush();
    }

    public function createAllCurrencyPairs(TrackedCurrency $newTrackedCurrency): void
    {
        $trackedCurrencies = $this->trackedCurrencyRepository->findAll();
        $trackedCurrenciesCodes = array_map(
            fn(TrackedCurrency $trackedCurrency) => $trackedCurrency->currencyCode->value,
            $trackedCurrencies,
        );
        $sellLatestExchangeResponse = $this->freeCurrencyApi->latestExchange(
            $newTrackedCurrency->currencyCode->value,
            $trackedCurrenciesCodes,
        );

        foreach ($trackedCurrencies as $trackedCurrency) {
            $sellPrice = $sellLatestExchangeResponse->getExchange($trackedCurrency->currencyCode->value);
            $this->createCurrencyPair($newTrackedCurrency, $trackedCurrency, $sellPrice);

            $buyLatestExchangeResponse = $this->freeCurrencyApi->latestExchange(
                $trackedCurrency->currencyCode->value,
                [$newTrackedCurrency->currencyCode->value],
            );
            $buyPrice = $buyLatestExchangeResponse->getExchange($newTrackedCurrency->currencyCode->value);
            $this->createCurrencyPair($trackedCurrency, $newTrackedCurrency, $buyPrice);
        }

        $newTrackedCurrency->latestUpdate = new DateTimeImmutable();
    }

    private function createCurrencyPair(
        TrackedCurrency $sellTrackedCurrency,
        TrackedCurrency $buyTrackedCurrency,
        float $price,
    ): CurrencyPair {
        $currencyPair = new CurrencyPair();
        $currencyPair->sellCurrency = $sellTrackedCurrency;
        $currencyPair->buyCurrency = $buyTrackedCurrency;
        $currencyPair->price = $price;
        $sellTrackedCurrency->buyCurrencyPairs->add($currencyPair);
        $buyTrackedCurrency->sellCurrencyPairs->add($currencyPair);
        $this->entityManager->persist($currencyPair);

        return $currencyPair;
    }
}
