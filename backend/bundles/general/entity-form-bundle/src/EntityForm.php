<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle;

use Dexodus\EntityFormBundle\Attribute\EntityForm as EntityFormAttribute;

class EntityForm
{
    public string $name;

    public string $entity;

    public object $form;

    public EntityFormAttribute $attribute;
}
