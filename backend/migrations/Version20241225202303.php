<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241225202303 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article ADD image_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E663DA5256D FOREIGN KEY (image_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_23A0E663DA5256D ON article (image_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E663DA5256D');
        $this->addSql('DROP INDEX IDX_23A0E663DA5256D');
        $this->addSql('ALTER TABLE article DROP image_id');
    }
}
