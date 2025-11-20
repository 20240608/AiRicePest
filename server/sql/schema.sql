-- MariaDB schema for AiRicePest
CREATE DATABASE IF NOT EXISTS airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE airicepest;

-- 用户表 - 添加识别计数和活跃状态
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(128) DEFAULT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  password_hash VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL,
  recognition_count INT DEFAULT 0 COMMENT '用户识别次数统计',
  is_active BOOLEAN DEFAULT TRUE COMMENT '用户是否活跃',
  INDEX idx_last_login (last_login),
  INDEX idx_recognition_count (recognition_count)
);

-- 识别历史表 - 添加用户ID和创建时间
CREATE TABLE IF NOT EXISTS history (
  id VARCHAR(32) PRIMARY KEY,
  user_id INT DEFAULT NULL COMMENT '关联用户ID',
  date DATE NOT NULL,
  image_url VARCHAR(512) DEFAULT NULL,
  disease_name VARCHAR(128) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 识别详情表 - 添加用户ID和创建时间
CREATE TABLE IF NOT EXISTS recognition_details (
  id VARCHAR(64) PRIMARY KEY,
  user_id INT DEFAULT NULL COMMENT '关联用户ID',
  disease_name VARCHAR(128) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  description TEXT,
  cause TEXT,
  solution_title VARCHAR(256),
  solution_steps TEXT COMMENT 'JSON字符串',
  image_url VARCHAR(512),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
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
  symptom_images TEXT DEFAULT NULL COMMENT '逗号分隔的图片路径，例如: image1.png,image2.png',
  pathogen_source TEXT,
  occurrence_conditions TEXT,
  generations_periods TEXT,
  transmission_routes TEXT,
  agricultural_control TEXT,
  physical_control TEXT,
  biological_control TEXT,
  chemical_control TEXT,
  INDEX idx_category (category),
  INDEX idx_disease_name (disease_name)
);

-- 反馈表 - 添加联系方式、反馈类型和更新时间
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL COMMENT '关联用户ID',
  username VARCHAR(64),
  text TEXT NOT NULL,
  contact VARCHAR(128) DEFAULT NULL COMMENT '联系方式（邮箱或手机）',
  image_urls TEXT COMMENT 'JSON字符串存储图片URL数组',
  feedback_type VARCHAR(32) DEFAULT 'general' COMMENT '反馈类型: bug, feature, recognition_issue, general',
  status ENUM('new','in_review','resolved') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_feedback_type (feedback_type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);