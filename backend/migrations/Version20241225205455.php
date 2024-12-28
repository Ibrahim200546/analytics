<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241225205455 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article ADD reply_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E668A0E4E7F FOREIGN KEY (reply_id) REFERENCES article (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_23A0E668A0E4E7F ON article (reply_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E668A0E4E7F');
        $this->addSql('DROP INDEX IDX_23A0E668A0E4E7F');
        $this->addSql('ALTER TABLE article DROP reply_id');
    }
}
