<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241214152543 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE subscription_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE subscription (id INT NOT NULL, organization_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A3C664D332C8A3DE ON subscription (organization_id)');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D332C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE organization ADD city_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE organization ADD creator_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE organization ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE organization ADD bin VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE organization ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('ALTER TABLE organization ADD edited_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('COMMENT ON COLUMN organization.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN organization.edited_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637C8BAC62AF FOREIGN KEY (city_id) REFERENCES city (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637C61220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_C1EE637C8BAC62AF ON organization (city_id)');
        $this->addSql('CREATE INDEX IDX_C1EE637C61220EA6 ON organization (creator_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE subscription_id_seq CASCADE');
        $this->addSql('ALTER TABLE subscription DROP CONSTRAINT FK_A3C664D332C8A3DE');
        $this->addSql('DROP TABLE subscription');
        $this->addSql('ALTER TABLE organization DROP CONSTRAINT FK_C1EE637C8BAC62AF');
        $this->addSql('ALTER TABLE organization DROP CONSTRAINT FK_C1EE637C61220EA6');
        $this->addSql('DROP INDEX IDX_C1EE637C8BAC62AF');
        $this->addSql('DROP INDEX IDX_C1EE637C61220EA6');
        $this->addSql('ALTER TABLE organization DROP city_id');
        $this->addSql('ALTER TABLE organization DROP creator_id');
        $this->addSql('ALTER TABLE organization DROP name');
        $this->addSql('ALTER TABLE organization DROP bin');
        $this->addSql('ALTER TABLE organization DROP created_at');
        $this->addSql('ALTER TABLE organization DROP edited_at');
    }
}
