<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use Dexodus\TelegramParserBundle\Entity\TelegramAccount;
use Dexodus\TelegramParserBundle\Entity\TelegramChannel;
use Dexodus\TelegramParserBundle\Repository\TelegramAccountRepository;
use Dexodus\TelegramParserBundle\Service\TelegramClient;

class TelegramChannelProcessor implements ProcessorInterface
{
    public function __construct(
        private TelegramClient $telegramClient,
        private PersistProcessor $persistProcessor,
        private TelegramAccountRepository $telegramAccountRepository,
    ) {
    }

    /**
     * @param TelegramChannel $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {//@atamekenbusiness
        if ($operation instanceof Post) {
            $telegramAccount = $this->telegramAccountRepository->findOneWithMinimumParserLoad();
            $this->telegramClient->startSession($telegramAccount->name, $telegramAccount->apiId, $telegramAccount->apiHash);
            $data->channelName = $this->telegramClient->getChannelName($data->channelId);
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
