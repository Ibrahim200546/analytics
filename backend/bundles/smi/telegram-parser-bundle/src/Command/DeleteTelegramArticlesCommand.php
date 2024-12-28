<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Command;

use Dexodus\SmiParserBundle\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('telegram-parser:delete-articles')]
class DeleteTelegramArticlesCommand extends Command
{
    public function __construct(
        private ArticleRepository $articleRepository,
        private EntityManagerInterface $entityManager,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $articles = $this->articleRepository->findBy(['parser' => 'Telegram']);

        foreach ($articles as $article) {
            $this->entityManager->remove($article);
        }
        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
