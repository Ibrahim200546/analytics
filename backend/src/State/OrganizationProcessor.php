<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Organization;
use App\Entity\User;
use App\Exception\ForbiddenException;
use Symfony\Bundle\SecurityBundle\Security;

class OrganizationProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private Security $security,
    ) {
    }

    /**
     * @param Organization $data
     * @throws ForbiddenException
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $user = $this->security->getUser();

        if (!($user instanceof User)) {
            throw new ForbiddenException();
        }

        if ($operation instanceof Post) {
            $data->creator = $user;
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
