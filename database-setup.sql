-- PostgreSQL Database Setup Script
-- Run this script to create the necessary databases

-- Connect to PostgreSQL as postgres user
-- psql -U postgres

-- Create users database
CREATE DATABASE users;

-- Create notes database
CREATE DATABASE notes;

-- Verify databases were created
\l

-- Grant privileges (if using a different user)
-- GRANT ALL PRIVILEGES ON DATABASE users TO your_username;
-- GRANT ALL PRIVILEGES ON DATABASE notes TO your_username;

-- Connect to users database to verify
\c users

-- Tables will be auto-created by Spring Boot JPA (ddl-auto: update)
-- Expected table structure:

-- Users table (auto-created):
-- CREATE TABLE users (
--     id BIGSERIAL PRIMARY KEY,
--     username VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     first_name VARCHAR(255),
--     last_name VARCHAR(255),
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- Connect to notes database to verify
\c notes

-- Notes table (auto-created):
-- CREATE TABLE notes (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     content VARCHAR(2000),
--     pinned BOOLEAN NOT NULL DEFAULT false,
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- Sample data insertion (optional)
-- After running the application, you can insert sample data:

-- \c users
-- INSERT INTO users (username, password, email, first_name, last_name, created_at, updated_at)
-- VALUES ('admin', '$2a$10$encrypted_password_here', 'admin@example.com', 'Admin', 'User', NOW(), NOW());

-- \c notes
-- INSERT INTO notes (user_id, title, content, pinned, created_at, updated_at)
-- VALUES (1, 'Welcome Note', 'This is your first note!', true, NOW(), NOW());

-- Useful queries for verification
-- \c users
-- SELECT * FROM users;

-- \c notes
-- SELECT * FROM notes;

-- To drop databases (use with caution!)
-- DROP DATABASE IF EXISTS users;
-- DROP DATABASE IF EXISTS notes;

