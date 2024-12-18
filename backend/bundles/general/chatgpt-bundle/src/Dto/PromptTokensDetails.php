<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class PromptTokensDetails
{
    public function __construct(
        #[SerializedName('cached_tokens')]
        public int $cachedTokens,
        #[SerializedName('audio_tokens')]
        public int $audioTokens,
    ) {
    }
}
