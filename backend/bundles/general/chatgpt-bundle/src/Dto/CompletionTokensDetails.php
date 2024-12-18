<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class CompletionTokensDetails
{
    public function __construct(
        #[SerializedName('reasoning_tokens')]
        public int $reasoningTokens,
        #[SerializedName('audio_tokens')]
        public int $audioTokens,
        #[SerializedName('accepted_prediction_tokens')]
        public int $acceptedPredictionTokens,
        #[SerializedName('rejected_prediction_tokens')]
        public int $rejectedPredictionTokens,
    ) {
    }
}
