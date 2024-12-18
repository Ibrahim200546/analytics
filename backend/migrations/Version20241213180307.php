<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241213180307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD parser VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE article ADD source VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE article ADD original_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE article ADD image_url VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE article DROP parser');
        $this->addSql('ALTER TABLE article DROP source');
        $this->addSql('ALTER TABLE article DROP original_path');
        $this->addSql('ALTER TABLE article DROP image_url');
    }
}
