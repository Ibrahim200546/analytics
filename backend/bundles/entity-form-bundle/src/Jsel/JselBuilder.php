<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Jsel;

use Dexodus\EntityFormBundle\Exception\TypeNotSupportedException;

class JselBuilder
{
    private string $query = '';

    public function setVariableValue(string $variable, mixed $value): self
    {
        $processedValue = $this->processValue($value);
        $this->addToQuery("$variable = $processedValue");

        return $this;
    }

    public function getQuery(): string
    {
        return $this->query;
    }

    public function clearQuery(): void
    {
        $this->query = '';
    }

    protected function processValue(mixed $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_null($value)) {
            return 'null';
        }

        if (is_numeric($value)) {
            return (string) $value;
        }

        throw new TypeNotSupportedException($value);
    }

    protected function addToQuery(string $query): void
    {
        if ($this->query === '') {
            $this->query = $query;
        } else {
            $this->query .= ';' . $query;
        }
    }
}
