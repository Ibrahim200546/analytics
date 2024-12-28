<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241224123441 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE file_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE file_history_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE file_member_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE telegram_channel_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE file (id INT NOT NULL, owner_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, original_name VARCHAR(255) DEFAULT NULL, extension VARCHAR(255) NOT NULL, path VARCHAR(255) NOT NULL, nca_path VARCHAR(255) DEFAULT NULL, mime_type VARCHAR(255) DEFAULT NULL, saved_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, is_temp BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8C9F36107E3C61F9 ON file (owner_id)');
        $this->addSql('CREATE TABLE file_history (id INT NOT NULL, file_id INT NOT NULL, initiator_id INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, action VARCHAR(255) NOT NULL, data JSON DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7CDCC97093CB796C ON file_history (file_id)');
        $this->addSql('CREATE INDEX IDX_7CDCC9707DB3B714 ON file_history (initiator_id)');
        $this->addSql('COMMENT ON COLUMN file_history.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE file_member (id INT NOT NULL, file_id INT NOT NULL, user_id INT NOT NULL, roles JSON NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C8F3DCC793CB796C ON file_member (file_id)');
        $this->addSql('CREATE INDEX IDX_C8F3DCC7A76ED395 ON file_member (user_id)');
        $this->addSql('CREATE TABLE telegram_channel (id INT NOT NULL, image_id INT DEFAULT NULL, channel_id VARCHAR(255) NOT NULL, channel_name VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F9BFEFB13DA5256D ON telegram_channel (image_id)');
        $this->addSql('COMMENT ON COLUMN telegram_channel.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F36107E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file_history ADD CONSTRAINT FK_7CDCC97093CB796C FOREIGN KEY (file_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file_history ADD CONSTRAINT FK_7CDCC9707DB3B714 FOREIGN KEY (initiator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file_member ADD CONSTRAINT FK_C8F3DCC793CB796C FOREIGN KEY (file_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file_member ADD CONSTRAINT FK_C8F3DCC7A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE telegram_channel ADD CONSTRAINT FK_F9BFEFB13DA5256D FOREIGN KEY (image_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE file_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE file_history_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE file_member_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE telegram_channel_id_seq CASCADE');
        $this->addSql('ALTER TABLE file DROP CONSTRAINT FK_8C9F36107E3C61F9');
        $this->addSql('ALTER TABLE file_history DROP CONSTRAINT FK_7CDCC97093CB796C');
        $this->addSql('ALTER TABLE file_history DROP CONSTRAINT FK_7CDCC9707DB3B714');
        $this->addSql('ALTER TABLE file_member DROP CONSTRAINT FK_C8F3DCC793CB796C');
        $this->addSql('ALTER TABLE file_member DROP CONSTRAINT FK_C8F3DCC7A76ED395');
        $this->addSql('ALTER TABLE telegram_channel DROP CONSTRAINT FK_F9BFEFB13DA5256D');
        $this->addSql('DROP TABLE file');
        $this->addSql('DROP TABLE file_history');
        $this->addSql('DROP TABLE file_member');
        $this->addSql('DROP TABLE telegram_channel');
    }
}
