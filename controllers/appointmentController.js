const AppointmentModel = require('../models/appointmentModel');

const AppointmentController = {
    getAllAppointment: async (req, res) => {
        try {
            const appointments = await AppointmentModel.getAllAppointment();
            res.json(appointments);
        } catch (err) {
            console.error('Error fetching appointments: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createAppontment: async (req, res) => {
        try {
            const appointmentData = req.body;

            const newAppointmentData = await AppointmentModel.createAppointment(appointmentData);
            res.status(201).json(newAppointmentData);

        } catch (err) {
            console.error('Error creating appointment:', err);
            res.status(500).json({ error: 'Internal Server Error' })
        }
    },


    deleteAppointment: async (req, res) => {

        const { id } = req.params;

        try {
            const isDeleted = await AppointmentModel.deleteAppointment(id);
            if (isDeleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Appointment Not Found' })
            }
        } catch (err) {
            console.error('Error deleting appointment:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = AppointmentController;