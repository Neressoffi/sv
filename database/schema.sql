-- Base de données pour l'application Souvenirs à Deux
-- Exécutez ce script dans MySQL (phpMyAdmin, MySQL Workbench, ou ligne de commande)

CREATE DATABASE IF NOT EXISTS souvenirs_a_deux
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE souvenirs_a_deux;

-- Utilisateurs (couple)
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT NULL,
  partner_email VARCHAR(255) DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_partner_email (partner_email)
);

-- Souvenirs (photo + questions)
CREATE TABLE souvenirs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  created_by INT UNSIGNED NOT NULL,
  for_partner_email VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  questions JSON NOT NULL COMMENT 'Liste [{ "text": "..." }]',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_by (created_by),
  INDEX idx_for_partner (for_partner_email),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Réponses du partenaire au quiz (une ligne par souvenir)
CREATE TABLE souvenir_answers (
  souvenir_id INT UNSIGNED PRIMARY KEY,
  answered_by INT UNSIGNED NOT NULL,
  answers JSON NOT NULL COMMENT 'Objet { "0": "réponse1", "1": "réponse2" }',
  answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  verified_by_creator TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (souvenir_id) REFERENCES souvenirs(id) ON DELETE CASCADE,
  FOREIGN KEY (answered_by) REFERENCES users(id) ON DELETE CASCADE
);
