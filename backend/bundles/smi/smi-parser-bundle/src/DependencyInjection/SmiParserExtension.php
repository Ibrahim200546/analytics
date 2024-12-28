<?php

declare(strict_types=1);

namespace Dexodus\SmiParserBundle\DependencyInjection;

use Dexodus\SmiParserBundle\Service\ArticleCommentsTonerInterface;
use Dexodus\SmiParserBundle\Service\CommentsParserInterface;
use Dexodus\SmiParserBundle\Service\SmiParserInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

class SmiParserExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $container->registerForAutoconfiguration(SmiParserInterface::class)
            ->addTag('smi_parser.parser')
        ;
        $container->registerForAutoconfiguration(CommentsParserInterface::class)
            ->addTag('smi_parser.comments_parser')
        ;
        $container->registerForAutoconfiguration(ArticleCommentsTonerInterface::class)
            ->addTag('smi_parser.article_comments_toner')
        ;

        $loader = new YamlFileLoader($container, new FileLocator(dirname(__DIR__) . '/Resources/config'));
        $loader->load('services.yaml');

        $config = $this->processConfiguration(new Configuration(), $configs);
        $container->setParameter('smi_parser.article_comments_toner', $config['article_comments_toner']);
    }
}
