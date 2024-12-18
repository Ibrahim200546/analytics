<?php

declare(strict_types=1);

namespace App\Admin;

use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\LocationBundle\Entity\City;
use Dexodus\LocationBundle\Entity\District;
use Dexodus\LocationBundle\Entity\Region;
use Dexodus\TitleBundle\Attribute\Title;

class Location implements NavigationInterface
{
    #[Title('Области')]
    #[CrudNavigation(Region::class, Region::class)]
    public NavigationInterface $regions;

    #[Title('Районы')]
    #[CrudNavigation(District::class, District::class)]
    public NavigationInterface $districts;

    #[Title('Города')]
    #[CrudNavigation(City::class, City::class)]
    public NavigationInterface $cities;
}
