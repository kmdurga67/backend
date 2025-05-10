const pool = require('../config/database');


const AppointmentModel = {
    getAllAppointment: async () => {
        const { rows } = await pool.query(`SELECT * FROM appointments`);
        return rows;
    },

    createAppointment: async (appointmentData) => {
        const columns = Object.keys(appointmentData).join(', ');
        const values = Object.values(appointmentData);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');


        const { rows } = await pool.query(
            `INSERT INTO appointments (${columns}) VALUES (${placeholders}) RETURNING*`,
            values
        );

        return rows[0];
    },

    deleteAppointment: async (id) => {
        const { rowCount } = await pool.query(`DELETE FROM appointments WHERE id = $1`, [id]);

        return rowCount > 0;
    }
}

module.exports = AppointmentModel;