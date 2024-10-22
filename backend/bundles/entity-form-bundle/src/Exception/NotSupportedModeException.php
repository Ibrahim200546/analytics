<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Exception;

use Exception;

class NotSupportedModeException extends Exception
{
    public function __construct(string $entityFormClass, string $modeType, array $supportedModes)
    {
        $supportedModesInline = implode(', ', $supportedModes);

        parent::__construct(
            "EntityForm '$entityFormClass' can't support mode type '$modeType'. " .
            "Supported modes: $supportedModesInline"
        );
    }
}
