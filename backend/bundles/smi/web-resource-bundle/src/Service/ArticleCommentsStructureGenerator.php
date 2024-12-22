<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use Dexodus\ChatGPTBundle\Dto\Message;
use Dexodus\ChatGPTBundle\Enum\ChatGPTModelEnum;
use Dexodus\ChatGPTBundle\Enum\MessageRoleEnum;
use Dexodus\ChatGPTBundle\Service\ChatGPT;
use Dexodus\ChatGPTBundle\Service\JsonExtractorFromText;
use Dexodus\WebResourceBundle\Dto\ArticleCommentsStructure;
use Dexodus\WebResourceBundle\Dto\ArticleStructure;
use Symfony\Component\Serializer\SerializerInterface;

class ArticleCommentsStructureGenerator
{
    public function __construct(
        private HtmlUsefulBodyExtractor $htmlUsefulBodyExtractor,
        private HttpClient $httpClient,
        private ChatGPT $chatGPT,
        private SerializerInterface $serializer,
        private JsonExtractorFromText $jsonExtractorFromText,
    ) {
    }

    public function generate(string $link): ArticleCommentsStructure
    {
        $crawler = $this->httpClient->getCrawlerFromUrl($link);
        $usefulBody = $this->htmlUsefulBodyExtractor->extract($crawler);

        $prompt = <<<PROMPT
На основе предоставленного HTML-кода страницы, выдели и укажи CSS пути(не используй аттрибут id) до следующих элементов, связанных с комментариями:

1. commentsContainerCssPath: CSS путь до контейнера с комментариями. Если на странице есть несколько таких контейнеров, выбери тот, в котором больше всего комментариев.
2. commentContainerCssPath: CSS путь до контейнера с одним комментарием относительно commentsContainerCssPath.
3. commentatorNameCssPath: CSS путь до имени комментатора относительно commentContainerCssPath.
4. commentContentCssPath: CSS путь до контента комментария относительно commentContainerCssPath.
5. likesCssPath: CSS путь до количества лайков комментария относительно commentContainerCssPath.
6. dislikesCssPath: CSS путь до количества дизлайков комментария относительно commentContainerCssPath.
7. createdAtCssPath: CSS путь до даты создания комментария относительно commentContainerCssPath.

Верни результат в формате:
{commentsContainerCssPath:"",commentContainerCssPath:"",commentatorNameCssPath:"",commentContentCssPath:"",likesCssPath:"",dislikesCssPath:"",createdAtCssPath:"",getCommentsUrl:""}

Код страницы:
$usefulBody
PROMPT;

        $response = $this->chatGPT->execute(ChatGPTModelEnum::GPT_4O_MINI, [
            new Message(MessageRoleEnum::SYSTEM, 'Ты помощник для анализа HTML.'),
            new Message(MessageRoleEnum::USER, $prompt),
        ]);

        $messageContent = $response->choices[0]->message->content;
        $json = $this->jsonExtractorFromText->extract($messageContent);

        return $this->serializer->deserialize($json, ArticleCommentsStructure::class, 'json');
    }
}
