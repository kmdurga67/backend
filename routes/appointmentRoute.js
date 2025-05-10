const express = require('express');
const AppointmentController = require('../controllers/appointmentController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/appointments", authMiddleware, AppointmentController.getAllAppointment);
router.post("/create-appointment", AppointmentController.createAppontment);
router.delete("/:id", authMiddleware, AppointmentController.deleteAppointment);

module.exports = router;