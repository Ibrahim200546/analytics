<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\EventListener;

use DateInterval;
use DateTimeImmutable;
use Dexodus\SmiParserBundle\Entity\Article;
use Dexodus\SmiParserBundle\Service\GlobalSmiParser;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostLoadEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postLoad, method: 'postLoad', entity: Article::class)]
class UpdateArticleListener
{
    public function __construct(
        private GlobalSmiParser $globalSmiParser,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function postLoad(Article $article): void
    {
        if (!$article->isScheduledForUpdate && $article->lastUpdate->add(DateInterval::createFromDateString('15 minutes')) <= new DateTimeImmutable()) {
            $article->isScheduledForUpdate = true;
            $this->entityManager->flush();
            $this->globalSmiParser->parseArticle($article);
        }
    }
}
