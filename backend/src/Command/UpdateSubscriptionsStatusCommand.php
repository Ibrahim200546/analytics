<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\SubscriptionRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('subscription:status:update')]
class UpdateSubscriptionsStatusCommand extends Command
{
    public function __construct(
        private SubscriptionRepository $subscriptionRepository,
        private EntityManagerInterface $entityManager,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $subscriptions = $this->subscriptionRepository->findAll();

        foreach ($subscriptions as $subscription) {
            $subscription->active = new DateTimeImmutable() >= $subscription->start && $subscription->end >= new DateTimeImmutable();
            $organization = $subscription->organization;

            if ($subscription->active) {
                $subscription->end->diff(new DateTimeImmutable());
            }

            $statusName = $subscription->active ? '<question>Активированная</question>' : '<error>Деактивированная</error>';
            $output->writeln("<info>Статус подписки организации <comment>{$organization->name}</comment>: $statusName</info>");
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
