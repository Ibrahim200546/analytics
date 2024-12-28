<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\OrganizationAccount;
use App\Repository\OrganizationAccountRepository;
use Dexodus\SmiParserBundle\Dto\Reply;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Entity\ArticleComment;
use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Doctrine\ORM\EntityNotFoundException;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class CommentController
{
    public function __construct(
        private GlobalSmiParser $globalSmiParser,
        private OrganizationAccountRepository $organizationAccountRepository,
    ) {
    }

    #[Route('/smi/reply/comment/{id}', methods: ['POST'])]
    public function replyComment(ArticleComment $articleComment, #[MapRequestPayload] Reply $reply): Response
    {
        $organizationAccount = $this->organizationAccountRepository->find($reply->accountId);

        if (is_null($organizationAccount)) {
            throw new EntityNotFoundException('Organization Account not founded');
        }

        if ($this->globalSmiParser->replyComment($articleComment, $reply->comment, $organizationAccount)) {
            return new Response();
        }

        throw new Exception('Can\'t reply');
    }

    #[Route('/smi/reply/article/{id}', methods: ['POST'])]
    public function replyArticle(Article $article, #[MapRequestPayload] Reply $reply): Response
    {
        return new Response(
            'Reply article ' . $article->getId() . ' :) ' . $reply->accountId . ' | ' . $reply->comment,
        );
    }
}
