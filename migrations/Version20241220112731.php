<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241220112731 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE airport (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_7E91F7C2661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE authorized_expeditor (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, email VARCHAR(255) DEFAULT NULL, INDEX IDX_F6F2154661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE company (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_4FBF094F661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE disliked_hotel (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_E8291BB4661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE favorite_destination (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, INDEX IDX_FDD47BE9661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE favorite_hotel (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_B5DB75FD661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fidelity_program (id INT AUTO_INCREMENT NOT NULL, traveler_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, program_number INT DEFAULT NULL, INDEX IDX_126E040D776B35B0 (traveler_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE history (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, logo VARCHAR(255) DEFAULT NULL, departure_airport VARCHAR(255) DEFAULT NULL, arrival_airport VARCHAR(255) DEFAULT NULL, departure_date DATETIME DEFAULT NULL, arrival_date DATETIME DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, INDEX IDX_27BA704B661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shared_trip (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, email VARCHAR(255) DEFAULT NULL, is_shared TINYINT(1) NOT NULL, INDEX IDX_CCA09EA3661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscriber (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) DEFAULT NULL, is_subscribed TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE traveler (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, surname VARCHAR(255) DEFAULT NULL, birthdate DATE DEFAULT NULL, gender VARCHAR(255) DEFAULT NULL, second_name VARCHAR(255) DEFAULT NULL, phone INT DEFAULT NULL, dhs INT DEFAULT NULL, ktn INT DEFAULT NULL, INDEX IDX_6841F216661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE trip (id INT AUTO_INCREMENT NOT NULL, user_profile_id_id INT NOT NULL, destination VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, departure_date DATETIME DEFAULT NULL, arrival_date DATETIME DEFAULT NULL, consultation VARCHAR(255) DEFAULT NULL, INDEX IDX_7656F53B661EACD5 (user_profile_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, google_id VARCHAR(255) DEFAULT NULL, apple_id VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_profile (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, surname VARCHAR(255) DEFAULT NULL, username VARCHAR(255) DEFAULT NULL, avatar VARCHAR(255) DEFAULT NULL, site VARCHAR(255) DEFAULT NULL, local_airport VARCHAR(255) DEFAULT NULL, create_time DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_time DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_D95AB4059D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE airport ADD CONSTRAINT FK_7E91F7C2661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE authorized_expeditor ADD CONSTRAINT FK_F6F2154661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE disliked_hotel ADD CONSTRAINT FK_E8291BB4661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE favorite_destination ADD CONSTRAINT FK_FDD47BE9661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE favorite_hotel ADD CONSTRAINT FK_B5DB75FD661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE fidelity_program ADD CONSTRAINT FK_126E040D776B35B0 FOREIGN KEY (traveler_id_id) REFERENCES traveler (id)');
        $this->addSql('ALTER TABLE history ADD CONSTRAINT FK_27BA704B661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE shared_trip ADD CONSTRAINT FK_CCA09EA3661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE traveler ADD CONSTRAINT FK_6841F216661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE trip ADD CONSTRAINT FK_7656F53B661EACD5 FOREIGN KEY (user_profile_id_id) REFERENCES user_profile (id)');
        $this->addSql('ALTER TABLE user_profile ADD CONSTRAINT FK_D95AB4059D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE airport DROP FOREIGN KEY FK_7E91F7C2661EACD5');
        $this->addSql('ALTER TABLE authorized_expeditor DROP FOREIGN KEY FK_F6F2154661EACD5');
        $this->addSql('ALTER TABLE company DROP FOREIGN KEY FK_4FBF094F661EACD5');
        $this->addSql('ALTER TABLE disliked_hotel DROP FOREIGN KEY FK_E8291BB4661EACD5');
        $this->addSql('ALTER TABLE favorite_destination DROP FOREIGN KEY FK_FDD47BE9661EACD5');
        $this->addSql('ALTER TABLE favorite_hotel DROP FOREIGN KEY FK_B5DB75FD661EACD5');
        $this->addSql('ALTER TABLE fidelity_program DROP FOREIGN KEY FK_126E040D776B35B0');
        $this->addSql('ALTER TABLE history DROP FOREIGN KEY FK_27BA704B661EACD5');
        $this->addSql('ALTER TABLE shared_trip DROP FOREIGN KEY FK_CCA09EA3661EACD5');
        $this->addSql('ALTER TABLE traveler DROP FOREIGN KEY FK_6841F216661EACD5');
        $this->addSql('ALTER TABLE trip DROP FOREIGN KEY FK_7656F53B661EACD5');
        $this->addSql('ALTER TABLE user_profile DROP FOREIGN KEY FK_D95AB4059D86650F');
        $this->addSql('DROP TABLE airport');
        $this->addSql('DROP TABLE authorized_expeditor');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE disliked_hotel');
        $this->addSql('DROP TABLE favorite_destination');
        $this->addSql('DROP TABLE favorite_hotel');
        $this->addSql('DROP TABLE fidelity_program');
        $this->addSql('DROP TABLE history');
        $this->addSql('DROP TABLE shared_trip');
        $this->addSql('DROP TABLE subscriber');
        $this->addSql('DROP TABLE traveler');
        $this->addSql('DROP TABLE trip');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_profile');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
