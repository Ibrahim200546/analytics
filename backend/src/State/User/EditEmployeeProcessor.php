<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class EditEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private UserPasswordHasherInterface $userPasswordHasher,
    ) {
    }

    /**
     * @param User $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if (is_string($data->plainPassword) && strlen($data->plainPassword) > 0) {
            $password = $this->userPasswordHasher->hashPassword($data, $data->plainPassword);
            $data->setPassword($password);
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
