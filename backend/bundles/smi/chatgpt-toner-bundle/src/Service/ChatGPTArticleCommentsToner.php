<?php

declare(strict_types=1);

namespace Dexodus\ChatgptTonerBundle\Service;

use Dexodus\ChatGPTBundle\Dto\Message;
use Dexodus\ChatGPTBundle\Enum\ChatGPTModelEnum;
use Dexodus\ChatGPTBundle\Enum\MessageRoleEnum;
use Dexodus\ChatGPTBundle\Service\ChatGPT;
use Dexodus\ChatGPTBundle\Service\JsonExtractorFromText;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Enum\CommentToneEnum;
use Dexodus\SmiParserBundle\Service\ArticleCommentsTonerInterface;

class ChatGPTArticleCommentsToner implements ArticleCommentsTonerInterface
{
    public function __construct(
        private ChatGPT $chatGPT,
        private JsonExtractorFromText $jsonExtractorFromText,
    ) {
    }

    public function tone(Article $article): void
    {
        $needToneComments = [];

        foreach ($article->comments as $comment) {
            if (!$this->isCommentHaveTone($comment)) {
                $needToneComments[] = $comment;
            }
        }

        $commentsById = [];
        $commentsList = [];

        foreach ($needToneComments as $comment) {
            $commentsById[$comment->id] = $comment;
            $parsedComment = "-(commentId:$comment->id";

            if ($comment->reply instanceof ArticleComment) {
                $parsedComment .= ";replyId:{$comment->reply->id}";
            }

            $commentsList[] = $parsedComment . "):$comment->content";
        }

        if (empty($commentsList)) {
            return;
        }

        $commentsListString = implode(PHP_EOL, $commentsList);

        $prompt = <<<PROMPT
**Контекст новости:**  
Заголовок: $article->title
Контент: $article->content

**Комментарии:**  
$commentsListString  

**Формат ответа:**  
[
  {
    "commentId": "commentId",
    "tone": "positive|neutral|negative"
  }
]

Проанализируйте и верните результат.  
PROMPT;

        $response = $this->chatGPT->execute(ChatGPTModelEnum::GPT_4O_MINI, [
            new Message(MessageRoleEnum::SYSTEM, 'Вы — аналитик, который оценивает тональность комментариев на основе их содержания. Учитывай также настроение самой новости, например в случае трагедии, комментарии которые поддерживают родных и близких будут считаться положительными. Я предоставлю вам новость и связанные с ней комментарии. Ваша задача — оценить тональность каждого комментария (положительная, нейтральная, отрицательная) и ответить в формате JSON.'),
            new Message(MessageRoleEnum::USER, $prompt),
        ]);

        $messageContent = $response->choices[0]->message->content;
        $json = $this->jsonExtractorFromText->extract($messageContent);
        $tones = json_decode("[$json]", true);

        foreach ($tones as $tone) {
            $comment = $commentsById[(int) $tone['commentId']];
            $comment->tone = match ($tone['tone']) {
                "positive" => CommentToneEnum::POSITIVE,
                "neutral" => CommentToneEnum::NEUTRAL,
                "negative" => CommentToneEnum::NEGATIVE,
            };
        }
    }

    protected function isCommentHaveTone(ArticleComment $articleComment): bool
    {
        $articleComments = [$articleComment];

        while (!empty($articleComments)) {
            $articleComment = array_shift($articleComments);

            if ($articleComment->tone === CommentToneEnum::UNKNOWN) {
                return false;
            }

            $articleComments = [...$articleComments, ...$articleComment->replies->toArray()];
        }

        return true;
    }
}
