<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class Usage
{
    public function __construct(
        #[SerializedName('prompt_tokens')]
        public int $promptTokens,
        #[SerializedName('completion_tokens')]
        public int $completionTokens,
        #[SerializedName('total_tokens')]
        public int $totalTokens,
        #[SerializedName('prompt_tokens_details')]
        public PromptTokensDetails $promptTokensDetails,
        #[SerializedName('completion_tokens_details')]
        public CompletionTokensDetails $completionTokensDetails,
    ) {
    }
}
