<?php

declare(strict_types=1);

namespace Dexodus\EntityDisableBundle\EntityTable;

use Dexodus\EntityDisableBundle\Entity\WithDisableInterface;
use Doctrine\ORM\EntityManagerInterface;

class DisableAction
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(WithDisableInterface $entity): string
    {
        $entity->disable();
        $this->entityManager->flush();

        return 'refreshData()';
    }
}
