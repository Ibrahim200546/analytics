<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Project;
use App\Entity\User;
use App\Enum\PeriodEnum;
use App\Enum\Entity\UserRoleEnum;
use App\Repository\ProjectArticleRepository;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ProjectArticleAnalyticController
{
    public function __construct(
        private ProjectArticleRepository $projectArticleRepository,
    ) {
    }

    #[Route('/projects/{id}/analytic/new/{period}', methods: ['GET'])]
    public function countNewArticlesInPeriod(
        Project $project,
        PeriodEnum $period,
        #[CurrentUser] User $user,
    ): JsonResponse
    {
        $organization = $project->organization;
        $isAdmin = in_array(UserRoleEnum::ROLE_ADMIN->value, $user->getRoles(), true);
        $isOrganizationMember = $organization->creator === $user
            || $organization->supervisor === $user
            || $organization->employees->contains($user);

        if (!$isAdmin && !$isOrganizationMember) {
            throw new AccessDeniedHttpException();
        }

        $dateBorder = (new DateTimeImmutable())->modify(sprintf('-%d days', PeriodEnum::getDays($period)));
        $count = $this->projectArticleRepository->createQueryBuilder('projectArticle')
            ->select('COUNT(projectArticle.id)')
            ->innerJoin('projectArticle.article', 'article')
            ->andWhere('projectArticle.project = :project')
            ->andWhere('article.createdAt >= :dateBorder')
            ->setParameter('project', $project)
            ->setParameter('dateBorder', $dateBorder)
            ->getQuery()
            ->getSingleScalarResult();

        return new JsonResponse([
            'projectId' => $project->id,
            'period' => $period->value,
            'count' => (int) $count,
        ]);
    }
}
