<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\BackendAction;

use Dexodus\TelegramParserBundle\Entity\TelegramAccount;
use Doctrine\ORM\EntityManagerInterface;

class DisableForParsingAction
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(TelegramAccount $telegramAccount): string
    {
        $telegramAccount->usingForParsing = false;
        $this->entityManager->flush();

        return 'refreshData()';
    }
}
