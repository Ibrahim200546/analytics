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
use Symfony\Component\Console\Input\InputOption;
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

    protected function configure()
    {
        $this->addOption('generate-random-password', 'r', InputOption::VALUE_OPTIONAL, 'Generate random password', false);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = 'admin@ismi.kz';
        $password = $input->getOption('generate-random-password') ? substr(sha1((string) microtime(true)), 0, 8) : '12345';

        $output->writeln("<info>Admin password is <comment>$password</comment></info>");

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (is_null($user)) {
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
