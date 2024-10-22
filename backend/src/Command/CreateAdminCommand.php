<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand('admin:create')]
class CreateAdminCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = 'admin@admin.test';
        $password = '12345';

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (is_null($user)) {
            $user = new User();
            $user->setEmail($email);
            $user->setPassword($this->userPasswordHasher->hashPassword($user, $password));
            $user->setRoles([UserRoleEnum::ROLE_ADMIN->value, UserRoleEnum::ROLE_USER->value]);
            $this->entityManager->persist($user);
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
