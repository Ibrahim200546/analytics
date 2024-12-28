<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Service;

use danog\MadelineProto\API;
use danog\MadelineProto\EventHandler\Message;
use danog\MadelineProto\Settings;
use danog\MadelineProto\Settings\AppInfo;
use danog\MadelineProto\TL\Types\LoginQrCode;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Dexodus\TelegramParserBundle\Repository\TelegramAccountRepository;
use Exception;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class TelegramClient
{
    private ?API $madelineProto = null;

    public function __construct(
        private TelegramAccountRepository $telegramAccountRepository,
        #[Autowire('%telegram_parser.api_id%')]
        private string $apiId,
        #[Autowire('%telegram_parser.api_hash%')]
        private string $apiHash,
        #[Autowire('%env(POSTGRES_DB)%')]
        private string $databaseName,
        #[Autowire('%env(POSTGRES_PASSWORD)%')]
        private string $databasePassword,
        #[Autowire('%env(POSTGRES_USER)%')]
        private string $databaseUser,
        #[Autowire('%env(POSTGRES_HOST)%')]
        private string $databaseHost,
    ) {
    }

    public function startSession(string $name, int $apiId, string $apiHash): LoginQrCode | null
    {
        $settings = new Settings();
        $settings->setAppInfo((new AppInfo())
            ->setApiId($apiId)
            ->setApiHash($apiHash)
        );
        $settings->setDb((new Settings\Database\Postgres())
            ->setUri('tcp://' . $this->databaseHost . ':5432')
            ->setDatabase($this->databaseName)
            ->setUsername($this->databaseUser)
            ->setPassword($this->databasePassword)
            ->setEphemeralFilesystemPrefix($name)
        );

        if ($this->madelineProto instanceof API) {
            unset($this->madelineProto);
        }

        $this->madelineProto = new API($name, $settings);

        return $this->madelineProto->qrLogin();
    }

    /**
     * @param string $channel
     * @param int $limit
     * @param int $offset
     * @return Message[]
     */
    public function fetchMessages(string $channel, int $limit = 100, int $offset = 0): array
    {
        $messages = $this->madelineProto->messages->getHistory([
            'peer' => $channel,
            'offset_id' => 0,
            'offset_date' => 0,
            'add_offset' => $offset,
            'limit' => $limit,
            'max_id' => 0,
            'min_id' => 0,
            'hash' => 0,
        ]);

        $messageObjects = [];

        foreach ($messages['messages'] as $message) {
            $messageObjects[] = $this->madelineProto->wrapMessage($message);
        }

        return $messageObjects;
    }

    public function getChannelName(string $channel): string
    {
        return $this->madelineProto->getFullInfo($channel)['Chat']['title'];
    }

    public function startTelegramSessionForParsing(int $needParseCountMessages): void
    {
        $telegramAccount = $this->telegramAccountRepository->findOneWithMinimumParserLoad();

        if (is_null($telegramAccount)) {
            throw new Exception('Не получилось найти телеграмм аккаунт для парсинга');
        }

        $this->startSession($telegramAccount->name, $telegramAccount->apiId, $telegramAccount->apiHash);
        $telegramAccount->parserLoad += $needParseCountMessages;
    }

    public function getMessage(string $channelId, int $messageId): Message
    {
        $message = $this->madelineProto->wrapMessage($this->madelineProto->channels->getMessages(channel: $channelId, id: [$messageId])['messages'][0]);

        if ($message instanceof Message) {
            return $message;
        }

        throw new Exception();
    }

    public function getMessageComments(Message $message): array
    {
        $discussionMessage = $this->madelineProto->messages->getDiscussionMessage(peer: $message->chatId, msg_id: $message->id);

        if (empty($discussionMessage['messages'])) {
            return [];
        }

        $discussionMessage = $this->madelineProto->wrapMessage($discussionMessage['messages'][0]);
        $replies = $this->madelineProto->messages->getReplies(peer: $discussionMessage->chatId, msg_id: $discussionMessage->id, limit: 50);
        $countComments = $replies['count'];
        $messages = $replies['messages'];
        $users = $replies['users'];

        for ($i = 50; $i < $countComments; $i += 50) {
            $replies = $this->madelineProto->messages->getReplies(
                peer: $discussionMessage->chatId,
                msg_id: $discussionMessage->id,
                add_offset: $i,
                limit: 50
            );

            $messages = array_merge($messages, $replies['messages']);
            $users = array_merge($messages, $replies['users']);
            usleep(rand(1968, 3247));
        }

        $usersByIds = [];

        foreach ($users as $user) {
            $usersByIds[$user['id']] = $user;
        }

        return [
            'messages' => array_map(fn ($message) => $this->madelineProto->wrapMessage($message), $messages),
            'users' => $usersByIds,
        ];
    }

    public function reply(ArticleComment $reply, string $comment): Message | bool
    {
        try {
            $discussionMessage = $this->madelineProto->messages->getDiscussionMessage(peer: $reply->article->source, msg_id: (int) $reply->article->originalPath);
            $discussionMessage = $this->madelineProto->wrapMessage($discussionMessage['messages'][0]);
            $replyMessage = $this->getMessage((string) $discussionMessage->chatId, (int) $reply->sourceId);
            return $replyMessage->reply($comment);
        } catch (Exception) {
            return false;
        }
    }
}
