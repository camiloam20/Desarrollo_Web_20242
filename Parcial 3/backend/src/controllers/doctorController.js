import * as doctorService from '../services/doctorService.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorService.validateDoctor(email, password);
    
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { date } = req.query;
    const appointments = await doctorService.getAppointments(req.doctor.id, date);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await doctorService.createAppointment(
      req.doctor.id,
      req.body
    );
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await doctorService.updateAppointment(
      req.params.appointmentId,
      req.doctor.id,
      req.body
    );
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    await doctorService.deleteAppointment(
      req.params.appointmentId,
      req.doctor.id
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getPatient = async (req, res, next) => {
  try {
    const patient = await doctorService.getPatient(req.params.patientId);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await doctorService.getPatientAppointments(
      req.params.patientId
    );
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};