<?php

declare(strict_types=1);

namespace Dexodus\FreeCurrencyApiBundle\Dto\Response;

use Dexodus\FreeCurrencyApiBundle\Dto\Item\CurrencyDto;

readonly class CurrenciesResponse implements ResponseInterface
{
    /**
     * @param array<string, CurrencyDto> $data
     */
    public function __construct(
        public array $data,
    ) {
    }
}
