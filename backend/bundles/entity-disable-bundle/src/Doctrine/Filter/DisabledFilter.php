<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\Doctrine\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

class DisabledFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        if (!$targetEntity->hasField('disabled')) {
            return '';
        }

        return sprintf('%s.disabled = false', $targetTableAlias);
    }
}
