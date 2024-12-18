<?php

declare(strict_types=1);

namespace Dexodus\UserSessionHistoryBundle\State;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Dexodus\UserSessionHistoryBundle\Repository\UserSessionRepository;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Symfony\Bundle\SecurityBundle\Security;

class MySessionsProvider implements ProviderInterface
{
    private const COUNT_ITEMS_ON_PAGE = 10;

    public function __construct(
        private UserSessionRepository $userSessionRepository,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $filterPage = 1;

        if (isset($context['filters']['page'])) {
            $filterPage = (int)$context['filters']['page'];
        }

        $filterPage--;

        $offset = $filterPage * self::COUNT_ITEMS_ON_PAGE;
        $queryBuilder = $this->userSessionRepository->getQueryBuilderByUser(
            $this->security->getUser(),
            self::COUNT_ITEMS_ON_PAGE,
            $offset,
        );

        return new Paginator(new DoctrinePaginator($queryBuilder));
    }
}
