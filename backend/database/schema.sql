CREATE DATABASE IF NOT EXISTS lawyers_aid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lawyers_aid;

CREATE TABLE IF NOT EXISTS lawyers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bar_enrollment_no VARCHAR(60) NOT NULL UNIQUE,
  practice_area VARCHAR(255) NOT NULL,          -- comma separated, e.g. "Family, Criminal"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_code VARCHAR(30) UNIQUE,                 -- Case ID shown to user (LA-2026-00001)
  lawyer_id INT NOT NULL,
  case_no VARCHAR(80) NOT NULL,
  case_title VARCHAR(255) NOT NULL,
  case_type VARCHAR(60) NOT NULL,
  current_status VARCHAR(40) NOT NULL,
  filing_date DATE NOT NULL,
  next_hearing_date DATE NULL,
  client_name VARCHAR(120) NOT NULL,
  court_name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_lawyer_caseno (lawyer_id, case_no),
  INDEX idx_hearing (lawyer_id, next_hearing_date),
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

-- "What Changed" register: one row per changed field (old value + new value)
CREATE TABLE IF NOT EXISTS case_changes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  field_name VARCHAR(60) NOT NULL,
  old_value TEXT NULL,
  new_value TEXT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  doc_category ENUM('Legal Notice','Evidence','Court Order','Other') NOT NULL DEFAULT 'Other',
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size_bytes INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  case_id INT NOT NULL,
  hearing_date DATE NOT NULL,
  type ENUM('THREE_DAY','ONE_DAY','TODAY') NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reminder (case_id, hearing_date, type),   -- no duplicate reminders
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Law information shown to public users
CREATE TABLE IF NOT EXISTS laws (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(60) NOT NULL,                -- must match lawyer practice areas
  title VARCHAR(200) NOT NULL,
  act_name VARCHAR(200) NOT NULL,
  section_ref VARCHAR(100),
  summary TEXT NOT NULL,
  keywords VARCHAR(500),
  INDEX idx_cat (category)
);
