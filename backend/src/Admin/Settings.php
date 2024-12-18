<?php

declare(strict_types=1);

namespace App\Admin;

use Dexodus\AdminConstructorBundle\Attribute\CrudNavigation;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\WebResourceBundle\Entity\WebResource;

class Settings implements NavigationInterface
{
    #[CrudNavigation(WebResource::class, WebResource::class)]
    #[Title('Веб-ресурс')]
    public NavigationInterface $webResource;

    #[Title('Местоположения')]
    public Location $location;
}
