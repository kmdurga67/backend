const pool = require('../config/database');

const VisitorModel = {
    getAllVisitorsData : async () => {
        const {rows} = await pool.query(`SELECT * FROM visitors`);
        return rows;
    },

    getVisitorsById: async (id) => {
        const {rows} = await pool.query(`SELECT * FROM visitors WHERE id = $1`, [id]);
        return rows[0];
    },

    createVisitors: async (visitorData) => {
        const column = Object.keys(visitorData).join(', ');
        const values = Object.values(visitorData);
        const placeholders = values.map((__, index) => `$${index + 1}`).join(', ');

        const { rows } = await pool.query(
            `INSERT INTO visitors (${column}) VALUES (${placeholders})
            RETURNING *`,
            values
        );

        return rows[0];
    },

    updateVisitor: async (id, visitorData) => {
        const filteredData = Object.entries(visitorData).reduce((acc, [key, value]) => {
            if(value !== undefined && value !== null){
                acc[key] = value;
            }
            return acc;
        }, {});

        if(Object.keys(filteredData).length === 0){
            throw new Error("No valid fields provided for update");
        }

        const setClause = Object.keys(filteredData)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');
        
        const values = Object.values(filteredData);
        values.push(id);

        const query = {
            text: `UPDATE visitors SET ${setClause} WHERE id = $${values.length} RETURNING *`,
            values: values,
        };

        const { rows } = await pool.query(query);
        return rows[0];
    },

    deleteVisitor: async (id) => {
        const { rowCount } = await pool.query(`DELETE FROM visitors WHERE id = $1`, [id]);
        return rowCount > 0;
    }
}

module.exports = VisitorModel;