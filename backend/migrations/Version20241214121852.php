<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241214121852 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE city_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE district_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE organization_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE region_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE city (id INT NOT NULL, district_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2D5B0234B08FA272 ON city (district_id)');
        $this->addSql('CREATE TABLE district (id INT NOT NULL, region_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_31C1548798260155 ON district (region_id)');
        $this->addSql('CREATE TABLE organization (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE region (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE city ADD CONSTRAINT FK_2D5B0234B08FA272 FOREIGN KEY (district_id) REFERENCES district (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE district ADD CONSTRAINT FK_31C1548798260155 FOREIGN KEY (region_id) REFERENCES region (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE web_resource ALTER announce_css_path DROP NOT NULL');
        $this->addSql('ALTER TABLE web_resource ALTER created_at_css_path DROP NOT NULL');
        $this->addSql('ALTER TABLE web_resource ALTER image_css_path DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE city_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE district_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE organization_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE region_id_seq CASCADE');
        $this->addSql('ALTER TABLE city DROP CONSTRAINT FK_2D5B0234B08FA272');
        $this->addSql('ALTER TABLE district DROP CONSTRAINT FK_31C1548798260155');
        $this->addSql('DROP TABLE city');
        $this->addSql('DROP TABLE district');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE region');
        $this->addSql('ALTER TABLE web_resource ALTER announce_css_path SET NOT NULL');
        $this->addSql('ALTER TABLE web_resource ALTER created_at_css_path SET NOT NULL');
        $this->addSql('ALTER TABLE web_resource ALTER image_css_path SET NOT NULL');
    }
}
