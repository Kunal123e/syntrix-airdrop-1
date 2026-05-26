-- =====================================
-- Database: WorldData
-- =====================================

CREATE DATABASE IF NOT EXISTS WorldData;
USE WorldData;

-- =====================================
-- Table: Countries
-- =====================================
CREATE TABLE Countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) NOT NULL,
    continent VARCHAR(50)
);

-- =====================================
-- Table: Cities
-- =====================================
CREATE TABLE Cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES Countries(country_id)
);

-- =====================================
-- Table: Population
-- =====================================
CREATE TABLE Population (
    population_id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT,
    total_population BIGINT,
    year YEAR,
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

-- =====================================
-- Table: Income
-- =====================================
CREATE TABLE Income (
    income_id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT,
    average_income DECIMAL(12,2),
    currency VARCHAR(10),
    year YEAR,
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

-- =====================================
-- Sample Data Insert
-- =====================================

-- Countries
INSERT INTO Countries (country_name, continent) VALUES
('India', 'Asia'),
('USA', 'North America');

-- Cities
INSERT INTO Cities (city_name, country_id) VALUES
('Ahmedabad', 1),
('Mumbai', 1),
('New York', 2);

-- Population
INSERT INTO Population (city_id, total_population, year) VALUES
(1, 8000000, 2025),
(2, 20000000, 2025),
(3, 8500000, 2025);

-- Income
INSERT INTO Income (city_id, average_income, currency, year) VALUES
(1, 300000, 'INR', 2025),
(2, 500000, 'INR', 2025),
(3, 70000, 'USD', 2025);

-- =====================================
-- Test Query
-- =====================================
SELECT 
    c.city_name,
    co.country_name,
    p.total_population,
    i.average_income,
    i.currency
FROM Cities c
JOIN Countries co ON c.country_id = co.country_id
JOIN Population p ON c.city_id = p.city_id
JOIN Income i ON c.city_id = i.city_id;
