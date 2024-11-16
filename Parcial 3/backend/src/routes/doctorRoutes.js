import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateDoctor } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import * as doctorController from '../controllers/doctorController.js';

const router = Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate
], doctorController.login);

router.get('/appointment', 
  authenticateDoctor,
  doctorController.getAppointments
);

router.post('/appointment', [
  authenticateDoctor,
  body('patientId').isInt(),
  body('date').isDate(),
  body('hour').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  validate
], doctorController.createAppointment);

router.put('/appointment/:appointmentId', [
  authenticateDoctor,
  body('patientId').isInt(),
  body('date').isDate(),
  body('hour').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  validate
], doctorController.updateAppointment);

router.delete('/appointment/:appointmentId',
  authenticateDoctor,
  doctorController.deleteAppointment
);

router.get('/patient/:patientId',
  authenticateDoctor,
  doctorController.getPatient
);

router.get('/patient/:patientId/appointment',
  authenticateDoctor,
  doctorController.getPatientAppointments
);

export default router;