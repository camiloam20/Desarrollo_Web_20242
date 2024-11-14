-- Eliminar la base de datos si existe y crearla nuevamente
DROP DATABASE IF EXISTS db_booknest;
CREATE DATABASE db_booknest;

USE db_booknest;

-- Eliminar las tablas si existen (en orden inverso debido a las foreign keys)
DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- Crear las tablas
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  birth_year INT NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  pages INT NOT NULL,
  genre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE user_books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  status ENUM('read', 'reading', 'to-read') NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insertar un usuario administrador por defecto
INSERT INTO users (full_name, email, password, birth_year, username, is_admin)
VALUES ('Admin', 'admin@booknest.com', '$2b$10$ovYoWmwkLeytjyUtmMUQc.ckHfcqpkLekB7NkxlB3/v22Y3cWIlJC', 1990, 'admin', true);
-- La contraseña del admin es 'admin123' encriptada con bcrypt