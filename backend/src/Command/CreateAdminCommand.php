<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand('admin:create')]
final class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this
            ->addOption(
                'password',
                null,
                InputOption::VALUE_REQUIRED,
                'Set the initial admin password',
            )
            ->addOption(
                'generate-random-password',
                'r',
                InputOption::VALUE_NONE,
                'Generate a random password when no password is supplied',
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = 'admin@ismi.kz';
        $providedPassword = $input->getOption('password');
        $password = is_string($providedPassword) && $providedPassword !== ''
            ? $providedPassword
            : rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '=');

        if (strlen($password) < 12) {
            $output->writeln('<error>Password must be at least 12 characters.</error>');

            return Command::INVALID;
        }

        $output->writeln('<info>Admin password is <comment>'.$password.'</comment></info>');

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if ($user === null) {
            $user = new User();
            $user->setEmail($email);
            $user->setRoles([UserRoleEnum::ROLE_ADMIN->value, UserRoleEnum::ROLE_USER->value]);
            $user->lastName = 'The';
            $user->firstName = 'ISMI';
            $user->patronymic = 'Admin';
            $user->iin = '000000000000';
            $this->entityManager->persist($user);
        }

        $user->setPassword($this->userPasswordHasher->hashPassword($user, $password));
        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
