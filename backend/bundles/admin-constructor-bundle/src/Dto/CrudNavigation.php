<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Dto;

use Dexodus\TitleBundle\Attribute\Title;

class CrudNavigation implements NavigationInterface
{
    #[Title('Список {{ parentTitle|morphy(["МН", "РД"]) }}')]
    public PageInterface $list;

    #[Title('Создать {{ parentTitle|morphy(["ЕД", "ВН"]) }}')]
    public PageInterface $create;
}
