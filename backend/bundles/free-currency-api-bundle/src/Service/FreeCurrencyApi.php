<?php

declare(strict_types=1);

namespace Dexodus\FreeCurrencyApiBundle\Service;

use Dexodus\FreeCurrencyApiBundle\Dto\Response\CurrenciesResponse;
use Dexodus\FreeCurrencyApiBundle\Dto\Response\LatestExchangeResponse;
use Dexodus\FreeCurrencyApiBundle\Dto\Response\ResponseInterface;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\SerializerInterface;

class FreeCurrencyApi
{
    private const API_URL = 'https://api.freecurrencyapi.com/v1';

    public function __construct(
        #[Autowire('%free_currency_api.api_key%')]
        private string $apiKey,
        private SerializerInterface $serializer,
    ) {
    }

    /**
     * @param string[] $currencyCodes
     * @return CurrenciesResponse
     * @throws Exception
     */
    public function currencies(array $currencyCodes = []): CurrenciesResponse
    {
        /** @var CurrenciesResponse $response */
        $response = $this->execute(
            '/currencies',
            ['currencies' => implode(',', $currencyCodes)],
            CurrenciesResponse::class,
        );

        return $response;
    }

    /**
     * @param string $baseCurrencyCode
     * @param string[] $currencyCodes
     * @return LatestExchangeResponse
     * @throws Exception
     */
    public function latestExchange(string $baseCurrencyCode = 'USD', array $currencyCodes = []): LatestExchangeResponse
    {
        /** @var LatestExchangeResponse $response */
        $response = $this->execute(
            '/latest',
            ['base_currency' => $baseCurrencyCode, 'currencies' => implode(',', $currencyCodes)],
            LatestExchangeResponse::class,
        );

        return $response;
    }

    private function execute(string $method, array $options, string $responseClass): ResponseInterface
    {
        $guzzleClient = new Client();
        $result = $guzzleClient->get(self::API_URL . $method, [
            'query' => [...$options, 'apikey' => $this->apiKey],
        ]);

        if ($result->getStatusCode() !== 200) {
            throw new Exception('Problems with freecurrencyapi');
        }

        $data = $result->getBody()->getContents();

        return $this->serializer->deserialize($data, $responseClass, 'json');
    }
}
