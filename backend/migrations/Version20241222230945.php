<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241222230945 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_comment ADD source_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE article_comment ADD user_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE article_comment ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE article_comment DROP created_at_string');
        $this->addSql('COMMENT ON COLUMN article_comment.created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE article_comment ADD created_at_string VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE article_comment DROP source_id');
        $this->addSql('ALTER TABLE article_comment DROP user_id');
        $this->addSql('ALTER TABLE article_comment DROP created_at');
    }
}
