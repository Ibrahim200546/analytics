<?php

declare(strict_types=1);

namespace Dexodus\FreeCurrencyApiBundle\Dto\Response;

readonly class LatestExchangeResponse implements ResponseInterface
{
    /**
     * @param array<string, float> $data
     */
    public function __construct(
        public array $data,
    ) {
    }

    public function getExchange(string $currencyCode): ?float
    {
        return $this->data[$currencyCode] ?? null;
    }
}
