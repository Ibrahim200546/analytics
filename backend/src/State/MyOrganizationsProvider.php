<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Orm\Extension\FilterExtension;
use ApiPlatform\Doctrine\Orm\Extension\PaginationExtension;
use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Organization;
use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use App\Exception\ForbiddenException;
use App\Repository\OrganizationRepository;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Symfony\Bundle\SecurityBundle\Security;

class MyOrganizationsProvider implements ProviderInterface
{
    public function __construct(
        private OrganizationRepository $organizationRepository,
        private FilterExtension $filterExtension,
        private PaginationExtension $paginationExtension,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if ($user instanceof User && in_array(UserRoleEnum::ROLE_EMPLOYEE->value, $user->getRoles())) {
            $queryBuilder = $this->organizationRepository->createQueryBuilder('Organization');
            $queryBuilder
                ->andWhere('User.id = :userId')
                ->innerJoin('Organization.employees', 'User')
                ->setParameter('userId', $user->getId());

            return $queryBuilder->getQuery()->getOneOrNullResult();
        }

        if (!($user instanceof User) || !in_array(UserRoleEnum::ROLE_SUPERVISOR->value, $user->getRoles())) {
            throw new ForbiddenException();
        }

        $queryBuilder = $this->organizationRepository->createQueryBuilder('Organization');
        $queryBuilder
            ->andWhere('User.id = :userId')
            ->innerJoin('Organization.supervisor', 'User')
            ->setParameter('userId', $user->getId());

        $queryNameGenerator = new QueryNameGenerator();
        $this->filterExtension->applyToCollection($queryBuilder, $queryNameGenerator, Organization::class, $operation, $context);
        $this->paginationExtension->applyToCollection($queryBuilder, $queryNameGenerator, Organization::class, $operation, $context);

        return new Paginator(new DoctrinePaginator($queryBuilder));
    }
}
