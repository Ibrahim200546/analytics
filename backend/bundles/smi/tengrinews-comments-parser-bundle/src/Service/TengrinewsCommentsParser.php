<?php

declare(strict_types=1);

namespace Dexodus\TengrinewsCommentsParserBundle\Service;

use DateTimeImmutable;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Enum\CommentToneEnum;
use Dexodus\SmiParserBundle\Repository\ArticleCommentRepository;
use Dexodus\SmiParserBundle\Service\CommentsParserInterface;
use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Dexodus\TengrinewsApiBundle\Enum\ToneEnum;
use Dexodus\TengrinewsApiBundle\Service\RuSentiment;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use GuzzleHttp\Client;

class TengrinewsCommentsParser implements CommentsParserInterface
{
    public function __construct(
        private ArticleCommentRepository $articleCommentRepository,
        private EntityManagerInterface $entityManager,
        private GlobalSmiParser $globalSmiParser,
    ) {
    }

    public function parseComments(Article $article): void
    {
        $articleId = $this->getTengrinewsArticleId($article->originalPath);

        $payload = [
            'id' => (string)$articleId,
            'type' => 'news',
            'lang' => 'ru',
            'sort' => 'best',
        ];

        $headers = [
            'accept' => 'application/json, text/plain, */*',
            'accept-language' => 'en-US,en;q=0.9,ru;q=0.8',
            'cache-control' => 'no-cache',
            'content-type' => 'application/json;charset=UTF-8',
            'origin' => 'https://tengrinews.kz',
            'pragma' => 'no-cache',
            'priority' => 'u=1, i',
            'referer' => 'https://tengrinews.kz/',
            'sec-ch-ua' => '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile' => '?0',
            'sec-ch-ua-platform' => '"Linux"',
            'sec-fetch-dest' => 'empty',
            'sec-fetch-mode' => 'cors',
            'sec-fetch-site' => 'cross-site',
            'user-agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        ];

        $guzzleClient = new Client();
        $response = $guzzleClient->post('https://c.tn.kz/comments/get/list/', [
            'body' => json_encode($payload),
            'headers' => $headers,
        ]);

        $json = json_decode($response->getBody()->getContents(), true);
        $this->parseList($json['list'], $article);
        $this->globalSmiParser->parseArticleCommentsTone($article);
    }

    private function parseList(array $commentList, Article $article, ?ArticleComment $parent = null): void
    {
        foreach ($commentList as $commentItem) {
            $articleComment = $this->articleCommentRepository->findOneBy(['sourceId' => (string) $commentItem['id']]);

            if (is_null($articleComment)) {
                $articleComment = new ArticleComment();
                $articleComment->sourceId = (string) $commentItem['id'];
                $articleComment->userId = (string) $commentItem['user_id'];
                $articleComment->article = $article;
                $articleComment->tone = CommentToneEnum::UNKNOWN;

                if ($parent instanceof ArticleComment) {
                    $articleComment->reply = $parent;
                    $parent->replies->add($articleComment);
                }

                $this->entityManager->persist($articleComment);
            }

            $articleComment->commentatorName = $commentItem['name'];
            $articleComment->content = $commentItem['text'];
            $articleComment->createdAt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $commentItem['date']);
            $articleComment->likes = $commentItem['rating'];
            $this->parseList($commentItem['child'], $article, $articleComment);
        }
    }

    public function canParse(string $parser, string $source, string $originalPath): bool
    {
        return str_starts_with($originalPath, 'https://tengrinews.kz/');
    }

    private function getTengrinewsArticleId(string $articleUrl): int
    {
        $matches = [];

        if (preg_match('/(\d+)/', $articleUrl, $matches) === false) {
            throw new Exception('Cant parse article url for getting tengrinews article id');
        }

        return (int)$matches[1];
    }
}
