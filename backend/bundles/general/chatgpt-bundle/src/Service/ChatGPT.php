<?php

declare(strict_types=1);

namespace Dexodus\ChatGPTBundle\Service;

use Dexodus\ChatGPTBundle\Dto\Message;
use Dexodus\ChatGPTBundle\Dto\Response;
use Dexodus\ChatGPTBundle\Enum\ChatGPTModelEnum;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\SerializerInterface;

class ChatGPT
{
    public function __construct(
        #[Autowire('%chatgpt.api_key%')]
        private string $chatGPTKey,
        private SerializerInterface $serializer,
    ) {
    }

    /**
     * @param ChatGPTModelEnum $model
     * @param Message[] $messages
     * @return Response
     * @throws GuzzleException
     */
    public function execute(ChatGPTModelEnum $model, array $messages): Response
    {
        $client = new Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => "Bearer $this->chatGPTKey",
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => $model->value,
                'messages' => array_map(fn (Message $message) => [
                    'role' => $message->role->value,
                    'content' => $message->content,
                ], $messages),
            ],
        ]);

        $content = $response->getBody()->getContents();

        return $this->serializer->deserialize($content, Response::class, 'json');
    }
}
