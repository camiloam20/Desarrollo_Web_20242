CREATE DATABASE medical_appointments;

\c medical_appointments

CREATE TABLE specialty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    public BOOLEAN DEFAULT true
);

CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialty_id INTEGER REFERENCES specialty(id),
    public BOOLEAN DEFAULT true
);

CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    public BOOLEAN DEFAULT true
);

CREATE TABLE medical_appointment (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour TIME NOT NULL,
    patient_id INTEGER REFERENCES patient(id),
    doctor_id INTEGER REFERENCES doctor(id),
    public BOOLEAN DEFAULT true,
    UNIQUE (doctor_id, date, hour),
    UNIQUE (patient_id, date, hour)
);
