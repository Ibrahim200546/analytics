<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Dexodus\ChatGPTBundle\Dto\Message;
use Dexodus\ChatGPTBundle\Enum\ChatGPTModelEnum;
use Dexodus\ChatGPTBundle\Enum\MessageRoleEnum;
use Dexodus\ChatGPTBundle\Service\ChatGPT;
use Dexodus\ChatGPTBundle\Service\JsonExtractorFromText;
use Dexodus\WebResourceBundle\Dto\ArticleStructure;
use Symfony\Component\Serializer\SerializerInterface;

class ArticleStructureGenerator
{
    public function __construct(
        private HtmlUsefulBodyExtractor $htmlUsefulBodyExtractor,
        private HttpClient $httpClient,
        private ChatGPT $chatGPT,
        private SerializerInterface $serializer,
        private JsonExtractorFromText $jsonExtractorFromText,
    ) {
    }

    public function generate(string $link): ArticleStructure
    {
        $crawler = $this->httpClient->getCrawlerFromUrl($link);
        $usefulBody = $this->htmlUsefulBodyExtractor->extract($crawler);

        $prompt = <<<PROMPT
На основе предоставленного HTML-кода страницы новости, выдели CSS пути до следующих элементов:
1. titleCssPath: CSS путь до заголовка новости.
2. imageCssPath: CSS путь до изображения новости.
3. announceCssPath: CSS путь до анонса новости.
4. contentCssPath: CSS путь до основного контента новости.
5. createdAtCssPath: CSS путь до времени создания новости.
6. createdAtFormat: PHP-шаблон формата даты для функции DateTime::createFromFormat

Верни результат в формате:
{titleCssPath:"",imageCssPath:"",announceCssPath:"",contentCssPath:"",createdAtCssPath:"",createdAtFormat:""}

Код страницы:
$usefulBody
PROMPT;

        $response = $this->chatGPT->execute(ChatGPTModelEnum::GPT_4O_MINI, [
            new Message(MessageRoleEnum::SYSTEM, 'Ты помощник для анализа HTML.'),
            new Message(MessageRoleEnum::USER, $prompt),
        ]);

        $messageContent = $response->choices[0]->message->content;
        $json = $this->jsonExtractorFromText->extract($messageContent);

        return $this->serializer->deserialize($json, ArticleStructure::class, 'json');
    }
}
