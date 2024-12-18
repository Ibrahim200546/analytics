<?php

declare(strict_types=1);

namespace Dexodus\EntityHistoryBundle\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
class HideFromHistory
{
}
