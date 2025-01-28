<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250127152038 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE airport CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE auth0_connection CHANGE picture picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE authorized_expeditor CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE company CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE disliked_hotel CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE favorite_destination CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE address address VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE favorite_hotel CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE fidelity_program CHANGE name name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE google_connection CHANGE google_name google_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE history CHANGE logo logo VARCHAR(255) DEFAULT NULL, CHANGE departure_airport departure_airport VARCHAR(255) DEFAULT NULL, CHANGE arrival_airport arrival_airport VARCHAR(255) DEFAULT NULL, CHANGE departure_date departure_date DATETIME DEFAULT NULL, CHANGE arrival_date arrival_date DATETIME DEFAULT NULL, CHANGE description description VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE shared_trip CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE subscriber CHANGE email email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE traveler ADD phone_country INT DEFAULT NULL, ADD principal TINYINT(1) NOT NULL, CHANGE lastname lastname VARCHAR(255) DEFAULT NULL, CHANGE firstname firstname VARCHAR(255) DEFAULT NULL, CHANGE birthdate birthdate DATE DEFAULT NULL, CHANGE gender gender VARCHAR(255) DEFAULT NULL, CHANGE email email VARCHAR(255) DEFAULT NULL, CHANGE second_name second_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE trip CHANGE destination destination VARCHAR(255) DEFAULT NULL, CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE departure_date departure_date DATETIME DEFAULT NULL, CHANGE arrival_date arrival_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL, CHANGE password password VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user_profile CHANGE lastname lastname VARCHAR(255) DEFAULT NULL, CHANGE firstname firstname VARCHAR(255) DEFAULT NULL, CHANGE username username VARCHAR(255) DEFAULT NULL, CHANGE avatar avatar VARCHAR(255) DEFAULT NULL, CHANGE site site VARCHAR(255) DEFAULT NULL, CHANGE local_airport local_airport VARCHAR(255) DEFAULT NULL, CHANGE create_time create_time DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE update_time update_time DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE messenger_messages CHANGE delivered_at delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE airport CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE auth0_connection CHANGE picture picture VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE authorized_expeditor CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE company CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE disliked_hotel CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE favorite_destination CHANGE name name VARCHAR(255) DEFAULT \'NULL\', CHANGE address address VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE favorite_hotel CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE fidelity_program CHANGE name name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE google_connection CHANGE google_name google_name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE history CHANGE logo logo VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_airport departure_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE arrival_airport arrival_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_date departure_date DATETIME DEFAULT \'NULL\', CHANGE arrival_date arrival_date DATETIME DEFAULT \'NULL\', CHANGE description description VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE messenger_messages CHANGE delivered_at delivered_at DATETIME DEFAULT \'NULL\' COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE shared_trip CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE subscriber CHANGE email email VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE traveler DROP phone_country, DROP principal, CHANGE lastname lastname VARCHAR(255) DEFAULT \'NULL\', CHANGE firstname firstname VARCHAR(255) DEFAULT \'NULL\', CHANGE birthdate birthdate DATE DEFAULT \'NULL\', CHANGE gender gender VARCHAR(255) DEFAULT \'NULL\', CHANGE email email VARCHAR(255) DEFAULT \'NULL\', CHANGE second_name second_name VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE trip CHANGE destination destination VARCHAR(255) DEFAULT \'NULL\', CHANGE name name VARCHAR(255) DEFAULT \'NULL\', CHANGE departure_date departure_date DATETIME DEFAULT \'NULL\', CHANGE arrival_date arrival_date DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`, CHANGE password password VARCHAR(255) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user_profile CHANGE lastname lastname VARCHAR(255) DEFAULT \'NULL\', CHANGE firstname firstname VARCHAR(255) DEFAULT \'NULL\', CHANGE username username VARCHAR(255) DEFAULT \'NULL\', CHANGE avatar avatar VARCHAR(255) DEFAULT \'NULL\', CHANGE site site VARCHAR(255) DEFAULT \'NULL\', CHANGE local_airport local_airport VARCHAR(255) DEFAULT \'NULL\', CHANGE create_time create_time DATETIME DEFAULT \'NULL\' COMMENT \'(DC2Type:datetime_immutable)\', CHANGE update_time update_time DATETIME DEFAULT \'NULL\'');
    }
}
