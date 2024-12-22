<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241222192959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE web_resource ADD comments_container_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_container_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_commentator_name_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_content_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_likes_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_dislikes_css_path VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE web_resource ADD comment_created_at_css_path VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE web_resource DROP comments_container_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_container_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_commentator_name_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_content_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_likes_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_dislikes_css_path');
        $this->addSql('ALTER TABLE web_resource DROP comment_created_at_css_path');
    }
}
