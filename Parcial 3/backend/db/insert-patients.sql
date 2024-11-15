BEGIN;

INSERT INTO patient (name, age, email, password) VALUES
    ('Pedro Sánchez', 35, 'pedro.sanchez@gmail.com', '$2b$10$1234567890123456789012'),
    ('Laura Torres', 28, 'laura.torres@gmail.com', '$2b$10$1234567890123456789012'),
    ('Miguel Ángel', 45, 'miguel.angel@gmail.com', '$2b$10$1234567890123456789012'),
    ('Carmen Ruiz', 52, 'carmen.ruiz@gmail.com', '$2b$10$1234567890123456789012'),
    ('José Morales', 22, 'jose.morales@gmail.com', '$2b$10$1234567890123456789012'),
    ('Isabel Luna', 41, 'isabel.luna@gmail.com', '$2b$10$1234567890123456789012'),
    ('Roberto Gil', 38, 'roberto.gil@gmail.com', '$2b$10$1234567890123456789012'),
    ('Patricia Vega', 29, 'patricia.vega@gmail.com', '$2b$10$1234567890123456789012'),
    ('Fernando Díaz', 47, 'fernando.diaz@gmail.com', '$2b$10$1234567890123456789012'),
    ('Sofia Castro', 31, 'sofia.castro@gmail.com', '$2b$10$1234567890123456789012');

COMMIT;