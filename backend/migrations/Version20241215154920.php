<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241215154920 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE organization ADD supervisor_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637C19E9AC5F FOREIGN KEY (supervisor_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_C1EE637C19E9AC5F ON organization (supervisor_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE organization DROP CONSTRAINT FK_C1EE637C19E9AC5F');
        $this->addSql('DROP INDEX IDX_C1EE637C19E9AC5F');
        $this->addSql('ALTER TABLE organization DROP supervisor_id');
    }
}
