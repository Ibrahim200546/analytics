<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

readonly class Response
{
    /**
     * @param Choice[] $choices
     */
    public function __construct(
        public string $id,
        public string $object,
        public int $created,
        public string $model,
        public array $choices,
        public Usage $usage,
        #[SerializedName('system_fingerprint')]
        public string $systemFingerprint,
    ) {
    }
}
