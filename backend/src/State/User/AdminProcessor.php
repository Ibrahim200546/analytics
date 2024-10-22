<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use DateTimeImmutable;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private UserPasswordHasherInterface $userPasswordHasher,
    ) {
    }

    /** @param User $data */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $roles = $data->getRoles();
        $roles[] = UserRoleEnum::ROLE_ADMIN->value;
        $uniqueRoles = array_unique($roles);
        $data->setRoles($uniqueRoles);

        if (is_string($data->plainPassword) && $data->plainPassword !== '') {
            $password = $this->userPasswordHasher->hashPassword($data, $data->plainPassword);
            $data->setPassword($password);
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
