<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\OrganizationRepository;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CreateEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private OrganizationRepository $organizationRepository,
        private UserPasswordHasherInterface $userPasswordHasher,
    ) {
    }

    /**
     * @param User $data
     * @throws Exception
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

        if ($organization->employees->count() >= $organization->limitEmployees) {
            throw new Exception('Limit employees');
        }

        $password = $this->userPasswordHasher->hashPassword($data, $data->plainPassword);
        $data->setPassword($password);

        $data->addRole(UserRoleEnum::ROLE_EMPLOYEE->value);
        $data->organizationWhenWorked = $organization;
        $organization->employees->add($data);
        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
