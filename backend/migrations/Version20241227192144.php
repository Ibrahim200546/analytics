<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241227192144 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE organization_account_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE organization_account (id INT NOT NULL, organization_id INT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, parser_name VARCHAR(255) NOT NULL, account_name VARCHAR(255) NOT NULL, options JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B0E4DEE732C8A3DE ON organization_account (organization_id)');
        $this->addSql('COMMENT ON COLUMN organization_account.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE organization_account ADD CONSTRAINT FK_B0E4DEE732C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE organization_account_id_seq CASCADE');
        $this->addSql('ALTER TABLE organization_account DROP CONSTRAINT FK_B0E4DEE732C8A3DE');
        $this->addSql('DROP TABLE organization_account');
    }
}
