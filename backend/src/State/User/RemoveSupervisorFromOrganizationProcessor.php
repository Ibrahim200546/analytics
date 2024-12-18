<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Repository\OrganizationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Request;

class RemoveSupervisorFromOrganizationProcessor implements ProcessorInterface
{
    public function __construct(
        private OrganizationRepository $organizationRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param User $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        /**
         * @var Request $request
         */
        $request = $context['request'];

        if (!$request->query->has('organizationId')) {
            throw new Exception('Query parameter "organizationId" is missed');
        }

        $organizationId = $request->query->get('organizationId');
        $organization = $this->organizationRepository->find($organizationId);

        if (is_null($organization)) {
            throw new Exception('Organization with id "' . $organizationId . '" not exists');
        }

        if ($organization->supervisor?->getId() !== $data->getId()) {
            throw new Exception('Something went wrong');
        }

        $organization->supervisor = null;
        $this->entityManager->flush();
    }
}
