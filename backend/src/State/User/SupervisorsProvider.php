<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Doctrine\Orm\Extension\FilterExtension;
use ApiPlatform\Doctrine\Orm\Extension\PaginationExtension;
use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;

class SupervisorsProvider implements ProviderInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private FilterExtension $filterExtension,
        private PaginationExtension $paginationExtension,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $queryBuilder = $this->userRepository->createQueryBuilder('User');
        $queryBuilder
            ->innerJoin('User.organizationsWhenSupervisor', 'Organization');

        $queryNameGenerator = new QueryNameGenerator();
        $this->filterExtension->applyToCollection($queryBuilder, $queryNameGenerator, User::class, $operation, $context);
        $this->paginationExtension->applyToCollection($queryBuilder, $queryNameGenerator, User::class, $operation, $context);

        return new Paginator(new DoctrinePaginator($queryBuilder));
    }
}
