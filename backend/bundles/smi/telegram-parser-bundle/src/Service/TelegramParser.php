<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Service;

use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Dexodus\SmiParserBundle\Service\SmiParserInterface;
use Dexodus\TelegramParserBundle\Message\ParseTelegramChannelMessage;
use Dexodus\TelegramParserBundle\Message\UpdateTelegramArticleMessage;
use Dexodus\TelegramParserBundle\Repository\TelegramAccountRepository;
use Dexodus\TelegramParserBundle\Repository\TelegramChannelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
use Symfony\Component\Messenger\MessageBusInterface;

class TelegramParser implements SmiParserInterface
{
    public function __construct(
        private TelegramChannelRepository $telegramChannelRepository,
        private MessageBusInterface $messageBus,
        private TelegramAccountRepository $telegramAccountRepository,
        private TelegramClient $telegramClient,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function parseNewArticles(ConsoleOutputInterface $output): void
    {
        $output->writeln('<info>Обработка телеграмм каналов...</info>');

        foreach ($this->telegramChannelRepository->findNotScheduledForUpdate() as $telegramChannel) {
            $channelSection = $output->section();
            $channelSection->writeln('<info>Обработка канала "<comment>' . $telegramChannel->channelName . ' </comment>"</info>');
            $telegramChannel->isScheduledForUpdate = true;
            $this->messageBus->dispatch(new ParseTelegramChannelMessage($telegramChannel->id, 10, 0));
        }

        $this->entityManager->flush();

        $output->writeln('<info>Обработка телеграмм каналов завершена</info>');
    }

    public function parse(Article $article): void
    {
        $this->messageBus->dispatch(new UpdateTelegramArticleMessage($article->getId()));
    }

    public function getParserName(): string
    {
        return 'Telegram';
    }

    public function getSourceFavicon(Article $article): string
    {
        return '/images/telegram_source.png';
    }

    public function getSourceName(Article $article): string
    {
        return $article->source;
    }

    public function getSourceLink(Article $article): string
    {
        return "https://t.me/atamekenbusiness/$article->originalPath";
    }

    public function replyComment(ArticleComment $articleComment, string $comment, ParserAccountInterface $parserAccount): string | false
    {
        $telegramAccount = $this->telegramAccountRepository->find($parserAccount->getAccountOptions()['telegramAccountId']);
        $this->telegramClient->startSession($telegramAccount->name, $telegramAccount->apiId, $telegramAccount->apiHash);
        $message = $this->telegramClient->reply($articleComment, $comment);

        if ($message) {
            return (string) $message->id;
        }

        return false;
    }
}
