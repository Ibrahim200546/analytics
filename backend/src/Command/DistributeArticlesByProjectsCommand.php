<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Project;
use App\Entity\ProjectArticle;
use App\Repository\ProjectRepository;
use Dexodus\SmiParserInterface\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use FOS\ElasticaBundle\Finder\FinderInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsCommand('articles:distribute')]
class DistributeArticlesByProjectsCommand extends Command
{
    public function __construct(
        private ProjectRepository $projectRepository,
        #[Autowire(service: 'fos_elastica.finder.articles')]
        private FinderInterface $articlesFinder,
        private EntityManagerInterface $entityManager,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $projects = $this->projectRepository->findAll();

        foreach ($projects as $project) {
            foreach ($project->articles as $projectArticle) {
                $this->entityManager->remove($projectArticle);
            }

            $this->findArticlesForProject($project);
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }

    /**
     * @return ProjectArticle[]
     */
    private function findArticlesForProject(Project $project): array
    {
        $projectArticles = [];

        foreach ($project->tags as $tag) {
            $articles = $this->findArticlesByTag($tag);

            foreach ($articles as $article) {
                $projectArticle = new ProjectArticle();
                $projectArticle->article = $article;
                $projectArticle->project = $project;
                $this->entityManager->persist($projectArticle);
                $projectArticles[] = $projectArticle;
            }
        }

        return $projectArticles;
    }

    /**
     * @param string $tag
     * @return Article[]
     */
    private function findArticlesByTag(string $tag): array
    {
        $searchQuery = [
            'query' => [
                'multi_match' => [
                    'query' => $tag, // Строка поиска
                    'fields' => ['title', 'announce', 'content'], // Поля для поиска
                    'type' => 'best_fields', // Используем лучшее совпадение
                    'operator' => 'and', // Все слова должны совпадать
                ]
            ]
        ];

        return $this->articlesFinder->find($searchQuery);
    }
}
