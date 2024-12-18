<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241215123455 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project ADD organization_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD tags JSON NOT NULL');
        $this->addSql('ALTER TABLE project ADD disabled BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2FB3D0EE32C8A3DE ON project (organization_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project DROP CONSTRAINT FK_2FB3D0EE32C8A3DE');
        $this->addSql('DROP INDEX IDX_2FB3D0EE32C8A3DE');
        $this->addSql('ALTER TABLE project DROP organization_id');
        $this->addSql('ALTER TABLE project DROP tags');
        $this->addSql('ALTER TABLE project DROP disabled');
    }
}
