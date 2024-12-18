<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Orm\Extension\FilterExtension;
use ApiPlatform\Doctrine\Orm\Extension\PaginationExtension;
use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Enum\Entity\UserRoleEnum;
use App\Exception\ForbiddenException;
use App\Repository\ProjectRepository;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;

class ProjectsForMyOrganizationProvider implements ProviderInterface
{
    public function __construct(
        private ProjectRepository $projectRepository,
        private FilterExtension $filterExtension,
        private PaginationExtension $paginationExtension,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if (!($user instanceof User) || (!$user->hasRole(UserRoleEnum::ROLE_SUPERVISOR->value) && !$user->hasRole(UserRoleEnum::ROLE_EMPLOYEE->value))) {
            throw new ForbiddenException();
        }

        $queryBuilder = $this->projectRepository->createQueryBuilder('Project');
        $queryBuilder
            ->andWhere('Employee.id = :userId OR Organization.supervisor = :userId')
            ->leftJoin('Project.organization', 'Organization')
            ->leftJoin('Organization.employees', 'Employee')
            ->setParameter('userId', $user->getId())
        ;

        /**
         * @var Request $request
         */
        $request = $context['request'];

        if ($request->query->has('organizationId')) {
            $queryBuilder
                ->andWhere('Organization.id = :organizationId')
                ->setParameter('organizationId', $request->query->get('organizationId'));
        }

        $queryNameGenerator = new QueryNameGenerator();
        $this->filterExtension->applyToCollection($queryBuilder, $queryNameGenerator, User::class, $operation, $context);
        $this->paginationExtension->applyToCollection($queryBuilder, $queryNameGenerator, User::class, $operation, $context);

        return new Paginator(new DoctrinePaginator($queryBuilder));
    }
}
