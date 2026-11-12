-- Base de données du projet scolaire Padel Avenue
CREATE DATABASE IF NOT EXISTS padel_avenue
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE padel_avenue;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE
);

-- Produits de départ (catalogue de démonstration)
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  emoji VARCHAR(10) DEFAULT NULL
);

INSERT INTO products (name, category, price, emoji) VALUES
('Elite Gold', 'Raquettes', 289.00, '🎾'),
('Premium Balls', 'Balles', 25.00, '🟡'),
('Black Edition', 'Sacs', 119.00, '🎒'),
('Court Pro', 'Chaussures', 199.00, '👟');
