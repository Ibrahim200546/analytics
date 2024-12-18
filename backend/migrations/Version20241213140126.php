<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241213140126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE web_resource ADD title_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD announce_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD content_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD created_at_css_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE web_resource ADD image_css_path VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE web_resource DROP title_css_path');
        $this->addSql('ALTER TABLE web_resource DROP announce_css_path');
        $this->addSql('ALTER TABLE web_resource DROP content_css_path');
        $this->addSql('ALTER TABLE web_resource DROP created_at_css_path');
        $this->addSql('ALTER TABLE web_resource DROP image_css_path');
    }
}
