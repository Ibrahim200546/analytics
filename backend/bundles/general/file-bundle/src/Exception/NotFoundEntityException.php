<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Exception;

use Exception;

final class NotFoundEntityException extends Exception
{
    public function __construct(?string $entityClass = null, ?int $desiredEntityId = null)
    {
        $idMessage = $desiredEntityId === null ? "" : sprintf("#%s", $desiredEntityId);
        $message = $entityClass === null ? "" : sprintf("Entity \"%s%s\" not found", $entityClass, $idMessage);

        parent::__construct($message);
    }
}
