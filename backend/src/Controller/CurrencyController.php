<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\CurrencyPair;
use App\Entity\TrackedCurrency;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/currencies')]
class CurrencyController
{
    public function __construct(
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/buy-pairs/{id}')]
    public function getBuyCurrencyPairs(TrackedCurrency $trackedCurrency): Response
    {
        $result = $this->serializer->serialize($trackedCurrency->buyCurrencyPairs, 'json', ['groups' => [CurrencyPair::ROLE_VIEW, TrackedCurrency::ROLE_VIEW]]);

        return new Response($result, headers: ['Content-Type' => 'application/json']);
    }

    #[Route('/sell-pairs/{id}')]
    public function getSellCurrencyPairs(TrackedCurrency $trackedCurrency): Response
    {
        $result = $this->serializer->serialize($trackedCurrency->sellCurrencyPairs, 'json', ['groups' => [CurrencyPair::ROLE_VIEW, TrackedCurrency::ROLE_VIEW]]);

        return new Response($result, headers: ['Content-Type' => 'application/json']);
    }
}
