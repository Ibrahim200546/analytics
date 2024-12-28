<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241227174034 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article ADD can_reply BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE article_comment ADD can_reply BOOLEAN DEFAULT false NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article DROP can_reply');
        $this->addSql('ALTER TABLE article_comment DROP can_reply');
    }
}
