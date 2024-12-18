<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241214223335 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE subscription ADD type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE subscription ADD start TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE subscription ADD "end" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE subscription ADD active BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE subscription ADD price INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subscription ADD price_for_project_improvements INT DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN subscription.start IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN subscription."end" IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE subscription DROP type');
        $this->addSql('ALTER TABLE subscription DROP start');
        $this->addSql('ALTER TABLE subscription DROP "end"');
        $this->addSql('ALTER TABLE subscription DROP active');
        $this->addSql('ALTER TABLE subscription DROP price');
        $this->addSql('ALTER TABLE subscription DROP price_for_project_improvements');
    }
}
