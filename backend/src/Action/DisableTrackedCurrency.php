<?php

declare(strict_types=1);

namespace App\Action;

use App\Entity\TrackedCurrency;
use Doctrine\ORM\EntityManagerInterface;

class DisableTrackedCurrency
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(TrackedCurrency $trackedCurrency): string
    {
        $trackedCurrency->disable();

        foreach ($trackedCurrency->buyCurrencyPairs as $buyCurrencyPair) {
            $buyCurrencyPair->disable();
        }

        foreach ($trackedCurrency->sellCurrencyPairs as $sellCurrencyPair) {
            $sellCurrencyPair->disable();
        }

        $this->entityManager->flush();

        return 'refreshData()';
    }
}
