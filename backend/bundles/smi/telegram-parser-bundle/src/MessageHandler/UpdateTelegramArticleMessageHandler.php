<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\MessageHandler;

use danog\MadelineProto\EventHandler\Media\Photo;
use danog\MadelineProto\EventHandler\Message;
use DateTimeImmutable;
use Dexodus\FileBundle\Service\UploadFileService;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Enum\CommentToneEnum;
use Dexodus\SmiParserBundle\Repository\ArticleCommentRepository;
use Dexodus\SmiParserBundle\Repository\ArticleRepository;
use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Dexodus\TelegramParserBundle\Message\UpdateTelegramArticleMessage;
use Dexodus\TelegramParserBundle\Service\TelegramClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateTelegramArticleMessageHandler
{
    public function __construct(
        private TelegramClient $telegramClient,
        private ArticleRepository $articleRepository,
        private UploadFileService $uploadFileService,
        private EntityManagerInterface $entityManager,
        private ArticleCommentRepository $articleCommentRepository,
        private GlobalSmiParser $globalSmiParser,
    ) {
    }

    public function __invoke(UpdateTelegramArticleMessage $updateTelegramArticleMessage)
    {
        $article = $this->articleRepository->find($updateTelegramArticleMessage->articleId);
        $this->telegramClient->startTelegramSessionForParsing(1);
        $message = $this->telegramClient->getMessage($article->source, (int) $article->originalPath);
        $article->title = explode(PHP_EOL, $message->message)[0];
        $article->content = implode('', array_map(fn ($part) => "<p>$part</p>", explode(PHP_EOL, $message->message)));
        $article->lastUpdate = new DateTimeImmutable();

        if ($message->media instanceof Photo) {
            $photoPath = $message->media->downloadToDir('/tmp/');
            $photoNameParts = explode('.', $photoPath);
            $photo = $this->uploadFileService->saveFile(file_get_contents($photoPath), sha1((string) microtime(true)) . $photoNameParts[count($photoNameParts) - 1], 'telegram', false);
            $article->image = $photo;
            unlink($photoPath);
        }

        $messageComments = $this->telegramClient->getMessageComments($message);
        $this->parseMessages($article, array_reverse($messageComments));
        $this->globalSmiParser->parseArticleCommentsTone($article);

        $article->isScheduledForUpdate = false;
        $this->entityManager->flush();
    }

    private function parseMessages(Article $article, array $messageComments): void
    {
        $messages = $messageComments['messages'];
        $users = $messageComments['users'];
        $articleComments = [];

        /** @var Message $message */
        foreach ($messages as $message) {
            $articleComment = $this->articleCommentRepository->findOneBy(['sourceId' => (string) $message->id]);

            if (is_null($articleComment)) {
                $articleComment = new ArticleComment();
                $articleComment->canReply = true;
                $articleComment->article = $article;
                $article->comments->add($articleComment);

                if (array_key_exists($message->replyToMsgId, $articleComments)) {
                    $articleComment->reply = $articleComments[$message->replyToMsgId];
                    $articleComment->reply->replies->add($articleComment);
                }

                $articleComment->startTrackedAt = new DateTimeImmutable();
                $articleComment->userId = (string) $message->senderId;
                $articleComment->sourceId = (string) $message->id;
                $articleComment->commentatorName = $this->getUserName($users[$message->senderId]);
                $articleComment->createdAt = (new DateTimeImmutable())->setTimestamp($message->date);
                $this->entityManager->persist($articleComment);
            }

            if ($message->message !== $articleComment->content) {
                $articleComment->content = $message->message;
                $articleComment->tone = CommentToneEnum::UNKNOWN;
            }

            $articleComments[$message->id] = $articleComment;
        }
    }

    private function getUserName(array $user): string
    {
        if (array_key_exists('first_name', $user) && array_key_exists('last_name', $user)) {
            return "{$user['last_name']} {$user['first_name']}";
        }

        if (array_key_exists('first_name', $user)) {
            return $user['first_name'];
        }

        if (array_key_exists('username', $user)) {
            return $user['username'];
        }

        return $user['id'];
    }
}
