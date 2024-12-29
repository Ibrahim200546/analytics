<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\MessageHandler;

use danog\MadelineProto\EventHandler\Media\Photo;
use danog\MadelineProto\EventHandler\Message;
use DateTimeImmutable;
use Dexodus\FileBundle\Entity\File;
use Dexodus\FileBundle\Service\FileWriter;
use Dexodus\FileBundle\Service\UploadFileService;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Repository\ArticleRepository;
use Dexodus\TelegramParserBundle\Entity\TelegramChannel;
use Dexodus\TelegramParserBundle\Message\ParseTelegramChannelMessage;
use Dexodus\TelegramParserBundle\Repository\TelegramAccountRepository;
use Dexodus\TelegramParserBundle\Repository\TelegramChannelRepository;
use Dexodus\TelegramParserBundle\Service\TelegramClient;
use Dexodus\TelegramParserBundle\Service\TelegramParser;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

#[AsMessageHandler]
class ParseTelegramChannelMessageHandler
{
    public function __construct(
        private TelegramChannelRepository $telegramChannelRepository,
        private TelegramClient $telegramClient,
        private ArticleRepository $articleRepository,
        private TelegramParser $telegramParser,
        private EntityManagerInterface $entityManager,
        private MessageBusInterface $messageBus,
        private UploadFileService $uploadFileService,
    ) {
    }

    public function __invoke(ParseTelegramChannelMessage $parseTelegramChannelMessage)
    {
        $telegramChannel = $this->telegramChannelRepository->find($parseTelegramChannelMessage->telegramChannelId);
        $this->telegramClient->startTelegramSessionForParsing($parseTelegramChannelMessage->limit);
        $messages = $this->telegramClient->fetchMessages(
            $telegramChannel->channelId,
            $parseTelegramChannelMessage->limit,
            $parseTelegramChannelMessage->offset,
        );

        $countAlreadyExists = 0;

        if (empty($messages)) {
            return;
        }

        foreach ($messages as $message) {
            $article = $this->parseTelegramMessage($message, $telegramChannel);

            if (!is_null($article->getId()) || $article->createdAt < $telegramChannel->parseToDate) {
                $countAlreadyExists++;
            } else {
                while ($article instanceof Article) {
                    $this->entityManager->persist($article);
                    $article = $article->reply;
                }
            }
        }

        if ($countAlreadyExists < $parseTelegramChannelMessage->limit) {
            $this->messageBus->dispatch(new ParseTelegramChannelMessage(
                $telegramChannel->id,
                $parseTelegramChannelMessage->limit,
                $parseTelegramChannelMessage->offset + $parseTelegramChannelMessage->limit,
            ), [new DelayStamp(5000 + rand(-467, 1193))]);
        } else {
            $telegramChannel->isScheduledForUpdate = false;
        }

        $this->entityManager->flush();
    }

    private function parseTelegramMessage(Message $message, TelegramChannel $telegramChannel): Article
    {
        $article = $this->articleRepository->findOneBy([
            'source' => $telegramChannel->channelId,
            'originalPath' => (string) $message->id,
        ]);

        if (is_null($article)) {
            $article = new Article();
            $article->parser = $this->telegramParser->getParserName();
            $article->source = $telegramChannel->channelId;
            $article->originalPath = (string) $message->id;
            $article->startTracked = new DateTimeImmutable();
            $article->createdAt = (new DateTimeImmutable())->setTimestamp($message->date);
            $article->canReply = true;
        } else {
            return $article;
        }

        $article->title = explode(PHP_EOL, $message->message)[0];
        $article->content = $message->message;

        if (!is_null($message->replyToMsgId)) {
            $article->reply = $this->parseTelegramMessage($message->getReply(), $telegramChannel);
            $article->reply->replies->add($article);
        }

//        if ($message->media instanceof Photo) {
//            $photoPath = $message->media->downloadToDir('/tmp/');
//            $photoNameParts = explode('.', $photoPath);
//            $photo = $this->uploadFileService->saveFile(file_get_contents($photoPath), sha1((string) microtime(true)) . $photoNameParts[count($photoNameParts) - 1], 'telegram', false);
//            $article->image = $photo;
//            unlink($photoPath);
//        }

        return $article;
    }
}
