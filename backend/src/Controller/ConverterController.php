<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\TrackedCurrencyRepository;
use App\Service\CurrencyConverter;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/converter')]
class ConverterController
{
    public function __construct(
        private TrackedCurrencyRepository $trackedCurrencyRepository,
        private CurrencyConverter $currencyConverter,
    ) {
    }

    #[Route('/convert/{fromCurrency}/{toCurrency}')]
    public function convert(string $fromCurrency, string $toCurrency, Request $request): Response
    {

        if (!$request->query->has('amount')) {
            throw new BadRequestException();
        }

        $amount = $request->query->get('amount');

        if (!is_numeric($amount)) {
            throw new BadRequestException();
        }

        $sellTrackedCurrency = $this->trackedCurrencyRepository->findOneBy(['currencyCode' => $fromCurrency]);

        if (is_null($sellTrackedCurrency)) {
            throw new BadRequestException();
        }

        $buyTrackedCurrency = $this->trackedCurrencyRepository->findOneBy(['currencyCode' => $toCurrency]);

        if (is_null($buyTrackedCurrency)) {
            throw new BadRequestException();
        }

        $result = $this->currencyConverter->convert((float) $amount, $sellTrackedCurrency, $buyTrackedCurrency);

        return new Response((string) $result, headers: ['Content-Type' => 'application/json']);
    }
}
