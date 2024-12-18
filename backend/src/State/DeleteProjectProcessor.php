<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class DeleteProjectProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param Project $data
     * @throws Exception
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($operation instanceof Delete) {
            $data->disable();
            $this->entityManager->flush();

            return;
        }

        throw new Exception('Not supported operation');
    }
}
