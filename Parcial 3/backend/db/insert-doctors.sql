BEGIN;

INSERT INTO doctor (name, age, email, password, specialty_id) VALUES
    ('Dr. Juan Pérez', 45, 'juan.perez@hospital.com', '$2b$10$1234567890123456789012', 1),
    ('Dra. María García', 38, 'maria.garcia@hospital.com', '$2b$10$1234567890123456789012', 2),
    ('Dr. Carlos López', 52, 'carlos.lopez@hospital.com', '$2b$10$1234567890123456789012', 3),
    ('Dra. Ana Martínez', 41, 'ana.martinez@hospital.com', '$2b$10$1234567890123456789012', 4),
    ('Dr. Luis Rodríguez', 35, 'luis.rodriguez@hospital.com', '$2b$10$1234567890123456789012', 5);

COMMIT;