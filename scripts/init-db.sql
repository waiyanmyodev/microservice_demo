-- Create database if not exists
SELECT 'CREATE DATABASE microservices_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'microservices_db');