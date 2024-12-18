<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241216182046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE project_article_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE project_article (id INT NOT NULL, article_id INT DEFAULT NULL, project_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_942402037294869C ON project_article (article_id)');
        $this->addSql('CREATE INDEX IDX_94240203166D1F9C ON project_article (project_id)');
        $this->addSql('ALTER TABLE project_article ADD CONSTRAINT FK_942402037294869C FOREIGN KEY (article_id) REFERENCES article (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE project_article ADD CONSTRAINT FK_94240203166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE project_article_id_seq CASCADE');
        $this->addSql('ALTER TABLE project_article DROP CONSTRAINT FK_942402037294869C');
        $this->addSql('ALTER TABLE project_article DROP CONSTRAINT FK_94240203166D1F9C');
        $this->addSql('DROP TABLE project_article');
    }
}
