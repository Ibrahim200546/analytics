<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Project;
use Exception;

class CreateProjectProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
    ) {
    }

    /**
     * @param Project $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data->organization->projects->count() >= $data->organization->limitProjects) {
            throw new Exception('Limit projects');
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
