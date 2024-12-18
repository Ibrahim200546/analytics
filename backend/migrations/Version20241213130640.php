<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241213130640 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE web_resource ADD article_link_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD container_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD pagination_css_path VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE web_resource DROP article_link_css_path');
        $this->addSql('ALTER TABLE web_resource DROP container_css_path');
        $this->addSql('ALTER TABLE web_resource DROP pagination_css_path');
    }
}
