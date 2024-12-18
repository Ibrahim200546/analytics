<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class Choice
{
    public function __construct(
        public int $index,
        public Message $message,
        public mixed $logprobs,
        #[SerializedName('finish_reason')]
        public mixed $finishReason,
    ) {
    }
}
