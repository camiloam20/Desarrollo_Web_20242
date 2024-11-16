import bcrypt from 'bcrypt';
import pool from '../config/database.js';

export const validateDoctor = async (email, password) => {
  const result = await pool.query(
    'SELECT * FROM doctor WHERE email = $1',
    [email]
  );
  
  const doctor = result.rows[0];
  if (!doctor) return null;

  const validPassword = await bcrypt.compare(password, doctor.password);
  return validPassword ? doctor : null;
};

export const getAppointments = async (doctorId, date) => {
    let query = 'SELECT ma.*, p.name as patient_name FROM medical_appointment ma ' +
                'JOIN patient p ON p.id = ma.patient_id ' +
                'WHERE doctor_id = $1';
    const params = [doctorId];
  
    if (date) {
      query += ' AND date = $2';
      params.push(date);
    }
  
    query += ' ORDER BY date, hour';
    const result = await pool.query(query, params);
    return result.rows;
  };

  
export const createAppointment = async (doctorId, { patientId, date, hour }) => {
  // Verificar si ya existe una cita para el doctor en esa fecha y hora
  const existingDoctorApp = await pool.query(
    'SELECT * FROM medical_appointment WHERE doctor_id = $1 AND date = $2 AND hour = $3',
    [doctorId, date, hour]
  );

  if (existingDoctorApp.rows.length > 0) {
    throw new Error('Ya existe una cita para el doctor en esta fecha y hora');
  }

  // Verificar si ya existe una cita para el paciente en esa fecha y hora
  const existingPatientApp = await pool.query(
    'SELECT * FROM medical_appointment WHERE patient_id = $1 AND date = $2 AND hour = $3',
    [patientId, date, hour]
  );

  if (existingPatientApp.rows.length > 0) {
    throw new Error('Ya existe una cita para el paciente en esta fecha y hora');
  }

  const result = await pool.query(
    'INSERT INTO medical_appointment (doctor_id, patient_id, date, hour) VALUES ($1, $2, $3, $4) RETURNING *',
    [doctorId, patientId, date, hour]
  );

  return result.rows[0];
};

export const updateAppointment = async (appointmentId, doctorId, { patientId, date, hour }) => {
  // Verificar si la cita pertenece al doctor
  const appointment = await pool.query(
    'SELECT * FROM medical_appointment WHERE id = $1 AND doctor_id = $2',
    [appointmentId, doctorId]
  );

  if (appointment.rows.length === 0) {
    throw new Error('Cita no encontrada o no autorizada');
  }

  // Verificar conflictos de horario (excluyendo la cita actual)
  const conflicts = await pool.query(
    `SELECT * FROM medical_appointment 
     WHERE ((doctor_id = $1 OR patient_id = $2) 
     AND date = $3 AND hour = $4 
     AND id != $5)`,
    [doctorId, patientId, date, hour, appointmentId]
  );

  if (conflicts.rows.length > 0) {
    throw new Error('Existe un conflicto de horario');
  }

  const result = await pool.query(
    'UPDATE medical_appointment SET patient_id = $1, date = $2, hour = $3 WHERE id = $4 AND doctor_id = $5 RETURNING *',
    [patientId, date, hour, appointmentId, doctorId]
  );

  return result.rows[0];
};

export const deleteAppointment = async (appointmentId, doctorId) => {
  const result = await pool.query(
    'DELETE FROM medical_appointment WHERE id = $1 AND doctor_id = $2 RETURNING *',
    [appointmentId, doctorId]
  );

  if (result.rows.length === 0) {
    throw new Error('Cita no encontrada o no autorizada');
  }
};

export const getPatient = async (patientId) => {
  const result = await pool.query(
    'SELECT id, name, age, email FROM patient WHERE id = $1',
    [patientId]
  );

  if (result.rows.length === 0) {
    throw new Error('Paciente no encontrado');
  }

  return result.rows[0];
};

export const getPatientAppointments = async (patientId) => {
  const result = await pool.query(
    `SELECT ma.*, d.name as doctor_name, s.name as specialty 
     FROM medical_appointment ma 
     JOIN doctor d ON d.id = ma.doctor_id 
     JOIN specialty s ON s.id = d.specialty_id 
     WHERE patient_id = $1 
     ORDER BY date, hour`,
    [patientId]
  );

  return result.rows;
};