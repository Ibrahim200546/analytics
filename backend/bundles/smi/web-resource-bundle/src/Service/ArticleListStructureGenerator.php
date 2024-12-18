<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Dexodus\ChatGPTBundle\Dto\Message;
use Dexodus\ChatGPTBundle\Enum\ChatGPTModelEnum;
use Dexodus\ChatGPTBundle\Enum\MessageRoleEnum;
use Dexodus\ChatGPTBundle\Service\ChatGPT;
use Dexodus\ChatGPTBundle\Service\JsonExtractorFromText;
use Dexodus\WebResourceBundle\Dto\ArticleListStructure;
use Symfony\Component\Serializer\SerializerInterface;

class ArticleListStructureGenerator
{
    public function __construct(
        private HtmlUsefulBodyExtractor $htmlUsefulBodyExtractor,
        private HttpClient $httpClient,
        private ChatGPT $chatGPT,
        private SerializerInterface $serializer,
        private JsonExtractorFromText $jsonExtractorFromText,
    ) {
    }

    public function generate(string $link): ArticleListStructure
    {
        $crawler = $this->httpClient->getCrawlerFromUrl($link);
        $usefulBody = $this->htmlUsefulBodyExtractor->extract($crawler);

        $prompt = <<<PROMPT
На основе предоставленного HTML-кода страницы новостей, выдели и укажи CSS пути до следующих элементов:
1. containerCssPath: CSS путь до контейнера со всеми новостями.
2. articleLinkCssPath: CSS путь относительно этого контейнера до ссылки на каждую новость.
3. articlesPathPattern: URL-шаблон для пагинации, в котором вместо номера страницы нужно указать {page}. На данный момент ссылка "$link" является первой страницей со списком новостей.

Верни результат в формате:
{containerCssPath:"",articleLinkCssPath:"",articlesPathPattern:""}

Код страницы:
$usefulBody
PROMPT;

        $response = $this->chatGPT->execute(ChatGPTModelEnum::GPT_4O_MINI, [
            new Message(MessageRoleEnum::SYSTEM, 'Ты помощник для анализа HTML.'),
            new Message(MessageRoleEnum::USER, $prompt),
        ]);

        $messageContent = $response->choices[0]->message->content;
        $json = $this->jsonExtractorFromText->extract($messageContent);

        return $this->serializer->deserialize($json, ArticleListStructure::class, 'json');
    }
}
