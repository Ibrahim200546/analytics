<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241022080854 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Init project';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE entity_history_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE entity_history_change_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ta_locale_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ta_translation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ta_translation_unit_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_session_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE entity_history (id INT NOT NULL, user_id INT DEFAULT NULL, entity_class VARCHAR(255) NOT NULL, entity_id JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B4774268A76ED395 ON entity_history (user_id)');
        $this->addSql('COMMENT ON COLUMN entity_history.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE entity_history_change (id INT NOT NULL, entity_history_id INT DEFAULT NULL, property_name VARCHAR(255) NOT NULL, old_value JSON DEFAULT NULL, new_value JSON DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9A4F55542CAB9604 ON entity_history_change (entity_history_id)');
        $this->addSql('CREATE TABLE ta_locale (id INT NOT NULL, translation_id INT DEFAULT NULL, locale VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_72D8D8379CAA2B25 ON ta_locale (translation_id)');
        $this->addSql('CREATE TABLE ta_translation (id INT NOT NULL, creator_id INT DEFAULT NULL, key TEXT NOT NULL, creation_type VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_601C77BC8A90ABA9 ON ta_translation (key)');
        $this->addSql('CREATE INDEX IDX_601C77BC61220EA6 ON ta_translation (creator_id)');
        $this->addSql('COMMENT ON COLUMN ta_translation.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE ta_translation_unit (id INT NOT NULL, translation_id INT DEFAULT NULL, locale_id INT DEFAULT NULL, creator_id INT DEFAULT NULL, value TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D28030CB9CAA2B25 ON ta_translation_unit (translation_id)');
        $this->addSql('CREATE INDEX IDX_D28030CBE559DFD1 ON ta_translation_unit (locale_id)');
        $this->addSql('CREATE INDEX IDX_D28030CB61220EA6 ON ta_translation_unit (creator_id)');
        $this->addSql('COMMENT ON COLUMN ta_translation_unit.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, disabled BOOLEAN DEFAULT false NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE TABLE user_session (id INT NOT NULL, user_id INT DEFAULT NULL, login_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, ip_address VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8849CBDEA76ED395 ON user_session (user_id)');
        $this->addSql('ALTER TABLE entity_history ADD CONSTRAINT FK_B4774268A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE entity_history_change ADD CONSTRAINT FK_9A4F55542CAB9604 FOREIGN KEY (entity_history_id) REFERENCES entity_history (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ta_locale ADD CONSTRAINT FK_72D8D8379CAA2B25 FOREIGN KEY (translation_id) REFERENCES ta_translation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ta_translation ADD CONSTRAINT FK_601C77BC61220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ta_translation_unit ADD CONSTRAINT FK_D28030CB9CAA2B25 FOREIGN KEY (translation_id) REFERENCES ta_translation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ta_translation_unit ADD CONSTRAINT FK_D28030CBE559DFD1 FOREIGN KEY (locale_id) REFERENCES ta_locale (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ta_translation_unit ADD CONSTRAINT FK_D28030CB61220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_session ADD CONSTRAINT FK_8849CBDEA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE entity_history_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE entity_history_change_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ta_locale_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ta_translation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ta_translation_unit_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE user_session_id_seq CASCADE');
        $this->addSql('ALTER TABLE entity_history DROP CONSTRAINT FK_B4774268A76ED395');
        $this->addSql('ALTER TABLE entity_history_change DROP CONSTRAINT FK_9A4F55542CAB9604');
        $this->addSql('ALTER TABLE ta_locale DROP CONSTRAINT FK_72D8D8379CAA2B25');
        $this->addSql('ALTER TABLE ta_translation DROP CONSTRAINT FK_601C77BC61220EA6');
        $this->addSql('ALTER TABLE ta_translation_unit DROP CONSTRAINT FK_D28030CB9CAA2B25');
        $this->addSql('ALTER TABLE ta_translation_unit DROP CONSTRAINT FK_D28030CBE559DFD1');
        $this->addSql('ALTER TABLE ta_translation_unit DROP CONSTRAINT FK_D28030CB61220EA6');
        $this->addSql('ALTER TABLE user_session DROP CONSTRAINT FK_8849CBDEA76ED395');
        $this->addSql('DROP TABLE entity_history');
        $this->addSql('DROP TABLE entity_history_change');
        $this->addSql('DROP TABLE ta_locale');
        $this->addSql('DROP TABLE ta_translation');
        $this->addSql('DROP TABLE ta_translation_unit');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE user_session');
    }
}
