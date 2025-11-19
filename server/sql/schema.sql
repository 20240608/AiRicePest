-- MariaDB schema for AiRicePest
CREATE DATABASE IF NOT EXISTS airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE airicepest;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(128) DEFAULT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  password_hash VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS history (
  id VARCHAR(32) PRIMARY KEY,
  date DATE NOT NULL,
  image_url VARCHAR(512) DEFAULT NULL,
  disease_name VARCHAR(128) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS recognition_details (
  id VARCHAR(64) PRIMARY KEY,
  disease_name VARCHAR(128) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  description TEXT,
  cause TEXT,
  solution_title VARCHAR(256),
  solution_steps TEXT,
  image_url VARCHAR(512)
);

-- knowledge_base: pest_id 为主键，symptom_images 存储逗号分隔的图片路径
CREATE TABLE IF NOT EXISTS knowledge_base (
  pest_id INT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  disease_name VARCHAR(128) NOT NULL,
  type_info VARCHAR(128),
  alias_names TEXT,
  core_features TEXT,
  affected_parts TEXT,
  symptom_images TEXT DEFAULT NULL,  -- 例如 '/images/image1.png,/images/image2.png'
  pathogen_source TEXT,
  occurrence_conditions TEXT,
  generations_periods TEXT,
  transmission_routes TEXT,
  agricultural_control TEXT,
  physical_control TEXT,
  biological_control TEXT,
  chemical_control TEXT
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(32),
  username VARCHAR(64),
  text TEXT NOT NULL,
  image_urls TEXT,
  status ENUM('new','in_review','resolved') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);