<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\TrackedCurrency;
use Exception;

class CurrencyConverter
{
    public function convert(float $amount, TrackedCurrency $sellCurrency, TrackedCurrency $buyCurrency): float
    {
        foreach ($sellCurrency->sellCurrencyPairs as $sellCurrencyPair) {
            if ($sellCurrencyPair->buyCurrency->id !== $buyCurrency->id) {
                continue;
            }

            return $sellCurrencyPair->price * $amount;
        }

        throw new Exception('Not founded currency pair');
    }
}
