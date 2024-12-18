<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241217224314 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE article_comment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE article_comment (id INT NOT NULL, article_id INT DEFAULT NULL, reply_id INT DEFAULT NULL, commentator_name VARCHAR(255) NOT NULL, content TEXT NOT NULL, likes INT DEFAULT 0 NOT NULL, dislikes INT DEFAULT 0 NOT NULL, created_at_string VARCHAR(255) NOT NULL, deleted_from_source BOOLEAN DEFAULT false NOT NULL, start_tracked_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_79A616DB7294869C ON article_comment (article_id)');
        $this->addSql('CREATE INDEX IDX_79A616DB8A0E4E7F ON article_comment (reply_id)');
        $this->addSql('COMMENT ON COLUMN article_comment.start_tracked_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE article_comment ADD CONSTRAINT FK_79A616DB7294869C FOREIGN KEY (article_id) REFERENCES article (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE article_comment ADD CONSTRAINT FK_79A616DB8A0E4E7F FOREIGN KEY (reply_id) REFERENCES article_comment (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE article_comment_id_seq CASCADE');
        $this->addSql('ALTER TABLE article_comment DROP CONSTRAINT FK_79A616DB7294869C');
        $this->addSql('ALTER TABLE article_comment DROP CONSTRAINT FK_79A616DB8A0E4E7F');
        $this->addSql('DROP TABLE article_comment');
    }
}
