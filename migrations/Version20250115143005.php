<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250115143005 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE auth0_connection (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, auth0_id VARCHAR(255) NOT NULL, picture VARCHAR(255) DEFAULT NULL, email_verified TINYINT(1) DEFAULT NULL, UNIQUE INDEX UNIQ_DC6802FFA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE google_connection (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, google_id VARCHAR(255) NOT NULL, google_name VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_D716D99DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE auth0_connection ADD CONSTRAINT FK_DC6802FFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE google_connection ADD CONSTRAINT FK_D716D99DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE airport CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE authorized_expeditor CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE company CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE disliked_hotel CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE favorite_destination CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE address address VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE favorite_hotel CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE fidelity_program CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE history CHANGE logo logo VARCHAR(255) DEFAULT NULL, CHANGE departure_airport departure_airport VARCHAR(255) DEFAULT NULL, CHANGE arrival_airport arrival_airport VARCHAR(255) DEFAULT NULL, CHANGE departure_date departure_date DATETIME DEFAULT NULL, CHANGE arrival_date arrival_date DATETIME DEFAULT NULL, CHANGE description description VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE shared_trip CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE subscriber CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE traveler ADD lastname VARCHAR(255) DEFAULT NULL, ADD firstname VARCHAR(255) DEFAULT NULL, DROP name, DROP surname, CHANGE birthdate birthdate DATE DEFAULT NULL, CHANGE gender gender VARCHAR(255) DEFAULT NULL, CHANGE email email VARCHAR(255) DEFAULT NULL, CHANGE second_name second_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE trip CHANGE destination destination VARCHAR(255) DEFAULT NULL, CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE departure_date departure_date DATETIME DEFAULT NULL, CHANGE arrival_date arrival_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', DROP username, DROP google_id, DROP apple_id, CHANGE roles roles JSON NOT NULL, CHANGE password password VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user_profile ADD lastname VARCHAR(255) DEFAULT NULL, ADD firstname VARCHAR(255) DEFAULT NULL, DROP name, DROP surname, CHANGE username username VARCHAR(255) DEFAULT NULL, CHANGE avatar avatar VARCHAR(255) DEFAULT NULL, CHANGE site site VARCHAR(255) DEFAULT NULL, CHANGE local_airport local_airport VARCHAR(255) DEFAULT NULL, CHANGE create_time create_time DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE update_time update_time DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE messenger_messages CHANGE delivered_at delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE auth0_connection DROP FOREIGN KEY FK_DC6802FFA76ED395');
        $this->addSql('ALTER TABLE google_connection DROP FOREIGN KEY FK_D716D99DA76ED395');
        $this->addSql('DROP TABLE auth0_connection');
        $this->addSql('DROP TABLE google_connection');
        $this->addSql('ALTER TABLE airport CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE authorized_expeditor CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE company CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE disliked_hotel CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE favorite_destination CHANGE name name VARCHAR(255) DEFAULT \'NULL\', CHANGE address address VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE favorite_hotel CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE fidelity_program CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE history CHANGE logo logo VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_airport departure_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE arrival_airport arrival_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_date departure_date DATETIME DEFAULT \'NULL\', CHANGE arrival_date arrival_date DATETIME DEFAULT \'NULL\', CHANGE description description VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE messenger_messages CHANGE delivered_at delivered_at DATETIME DEFAULT \'NULL\' COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE shared_trip CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE subscriber CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE traveler ADD name VARCHAR(255) DEFAULT \'NULL\', ADD surname VARCHAR(255) DEFAULT \'NULL\', DROP lastname, DROP firstname, CHANGE birthdate birthdate DATE DEFAULT \'NULL\', CHANGE gender gender VARCHAR(255) DEFAULT \'NULL\', CHANGE email email VARCHAR(255) DEFAULT \'NULL\', CHANGE second_name second_name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE trip CHANGE destination destination VARCHAR(255) DEFAULT \'NULL\', CHANGE name name VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_date departure_date DATETIME DEFAULT \'NULL\', CHANGE arrival_date arrival_date DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user ADD username VARCHAR(180) NOT NULL, ADD google_id VARCHAR(255) DEFAULT \'NULL\', ADD apple_id VARCHAR(255) DEFAULT \'NULL\', DROP created_at, DROP updated_at, CHANGE roles roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`, CHANGE password password VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user_profile ADD name VARCHAR(255) DEFAULT \'NULL\', ADD surname VARCHAR(255) DEFAULT \'NULL\', DROP lastname, DROP firstname, CHANGE username username VARCHAR(255) DEFAULT \'NULL\', CHANGE avatar avatar VARCHAR(255) DEFAULT \'NULL\', CHANGE site site VARCHAR(255) DEFAULT \'NULL\', CHANGE local_airport local_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE create_time create_time DATETIME DEFAULT \'NULL\' COMMENT \'(DC2Type:datetime_immutable)\', CHANGE update_time update_time DATETIME DEFAULT \'NULL\'');
    }
}
