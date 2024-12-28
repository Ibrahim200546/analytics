<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Entity;

interface ParserAccountInterface
{
    public function getParserName(): string;

    public function getAccountOptions(): array;

    public function getAccountName(): string;

    public function getAccountId(): int;
}
