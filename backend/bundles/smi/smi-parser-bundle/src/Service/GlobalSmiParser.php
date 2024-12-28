<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\Service;

use DateTimeImmutable;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Entity\ParserAccountInterface;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class GlobalSmiParser
{
    /**
     * @var SmiParserInterface[]
     */
    private array $parsers = [];

    /**
     * @var CommentsParserInterface[]
     */
    private array $commentsParsers = [];

    /**
     * @var ArticleCommentsTonerInterface[]
     */
    private array $articleCommentsToners = [];

    public function __construct(
        #[Autowire('%smi_parser.article_comments_toner%')]
        private string $articleCommentsTonerClass,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function addSmiParser(SmiParserInterface $parser): void
    {
        $this->parsers[$parser->getParserName()] = $parser;
    }

    public function addCommentsParser(CommentsParserInterface $parser): void
    {
        $this->commentsParsers[] = $parser;
    }

    public function addArticleCommentsToner(ArticleCommentsTonerInterface $articleCommentsToner): void
    {
        $this->articleCommentsToners[$articleCommentsToner::class] = $articleCommentsToner;
    }

    /**
     * Method will execute fast
     *
     * @param Article $article
     * @return void
     * @throws Exception
     */
    public function parseArticle(Article $article): void
    {
        if (!array_key_exists($article->parser, $this->parsers)) {
            throw new Exception("Smi parser '$article->parser' not founded");
        }

        $this->parsers[$article->parser]->parse($article);
    }

    /**
     * Method can execute slow
     *
     * @param Article $article
     * @return bool
     */
    public function parseComments(Article $article): bool
    {
        foreach ($this->commentsParsers as $commentsParser) {
            if ($commentsParser->canParse($article->parser, $article->source, $article->originalPath)) {
                $commentsParser->parseComments($article);

                return true;
            }
        }

        return false;
    }

    /**
     * Method can execute slow
     *
     * @param Article $article
     * @return void
     */
    public function parseArticleCommentsTone(Article $article): void
    {
        $articleCommentsToner = $this->getArticleCommentsToner();
        $articleCommentsToner->tone($article);
    }

    public function getSourceFavicon(Article $article): string
    {
        return $this->parsers[$article->parser]->getSourceFavicon($article);
    }

    public function getSourceName(Article $article): string
    {
        return $this->parsers[$article->parser]->getSourceName($article);
    }

    public function getSourceLink(Article $article): string
    {
        return $this->parsers[$article->parser]->getSourceLink($article);
    }

    public function parseNewArticles(ConsoleOutputInterface $output, array $parserNames)
    {
        foreach ($parserNames as $parserName) {
            if (!array_key_exists($parserName, $this->parsers)) {
                $availableParsers = implode(
                    ', ',
                    array_map(fn(string $parserName) => "'$parserName'", array_keys($this->parsers)),
                );
                throw new Exception(
                    "Not founded SMI parser with name '$parserName'. Available parsers: [$availableParsers]",
                );
            }

            $parser = $this->parsers[$parserName];
            $parser->parseNewArticles($output);
        }
    }

    public function getParserNames(): array
    {
        return array_keys($this->parsers);
    }

    protected function getArticleCommentsToner(): ArticleCommentsTonerInterface
    {
        if (!array_key_exists($this->articleCommentsTonerClass, $this->articleCommentsToners)) {
            $available = implode(', ', array_map(fn ($name) => '"' . $name . '"', array_keys($this->articleCommentsToners)));
            throw new Exception('Not founded article comments toner "' . $this->articleCommentsTonerClass . '". Available: [' . $available . ']');
        }

        return $this->articleCommentsToners[$this->articleCommentsTonerClass];
    }

    public function replyComment(ArticleComment $articleComment, string $comment, ParserAccountInterface $parserAccount): bool
    {
        $accountArticleComment = new ArticleComment();
        $accountArticleComment->canReply = true;
        $accountArticleComment->userId = 'ISMI_ACCOUNT:' . $parserAccount->getAccountId();
        $accountArticleComment->content = $comment;
        $accountArticleComment->commentatorName = $parserAccount->getAccountName();
        $accountArticleComment->startTrackedAt = new DateTimeImmutable();
        $accountArticleComment->createdAt = new DateTimeImmutable();
        $accountArticleComment->article = $articleComment->article;
        $accountArticleComment->article->comments->add($accountArticleComment);
        $accountArticleComment->reply = $articleComment;
        $accountArticleComment->canReply = true;
        $articleComment->replies->add($accountArticleComment);

        $messageId = $this->parsers[$parserAccount->getParserName()]->replyComment($articleComment, $comment, $parserAccount);

        if ($messageId) {
            $accountArticleComment->sourceId = $messageId;
            $this->entityManager->persist($accountArticleComment);
            $this->entityManager->flush();
        }

        return $messageId !== false;
    }
}
