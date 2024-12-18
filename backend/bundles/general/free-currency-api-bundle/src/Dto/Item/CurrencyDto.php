<?php

declare(strict_types=1);

namespace Dexodus\FreeCurrencyApiBundle\Dto\Item;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class CurrencyDto
{
    public function __construct(
        public string $symbol,

        public string $name,

        #[SerializedName('symbol_native')]
        public string $symbolNative,

        #[SerializedName('decimal_digits')]
        public int $decimalDigits,

        public int $rounding,

        public string $code,

        #[SerializedName('name_plural')]
        public string $namePlural,
    ) {
    }
}
