<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241022093227 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE currency_pair_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE tracked_currency_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE currency_pair (id INT NOT NULL, sell_currency_id INT DEFAULT NULL, buy_currency_id INT DEFAULT NULL, price DOUBLE PRECISION NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_83ED5D1D44813F90 ON currency_pair (sell_currency_id)');
        $this->addSql('CREATE INDEX IDX_83ED5D1D738AA936 ON currency_pair (buy_currency_id)');
        $this->addSql('COMMENT ON COLUMN currency_pair.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE tracked_currency (id INT NOT NULL, currency_name VARCHAR(255) NOT NULL, latest_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN tracked_currency.latest_update IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE currency_pair ADD CONSTRAINT FK_83ED5D1D44813F90 FOREIGN KEY (sell_currency_id) REFERENCES tracked_currency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE currency_pair ADD CONSTRAINT FK_83ED5D1D738AA936 FOREIGN KEY (buy_currency_id) REFERENCES tracked_currency (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE currency_pair_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE tracked_currency_id_seq CASCADE');
        $this->addSql('ALTER TABLE currency_pair DROP CONSTRAINT FK_83ED5D1D44813F90');
        $this->addSql('ALTER TABLE currency_pair DROP CONSTRAINT FK_83ED5D1D738AA936');
        $this->addSql('DROP TABLE currency_pair');
        $this->addSql('DROP TABLE tracked_currency');
    }
}
