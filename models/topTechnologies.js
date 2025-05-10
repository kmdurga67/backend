const pool = require('../config/database');

const TopTechnologies = {
    getAllTechologies: async () => {
        const { rows } = await pool.query(`SELECT * FROM toptechnologies`);
        return rows;
    },

    getTechnologyById: async (id) => {
        const { rows } = await pool.query(`SELECT * FROM toptechnologies WHERE id = $1`, [id]);
        return rows[0];
    },

    createTechnologies: async (toptechnologies) => {
        const columns = Object.keys(toptechnologies).join(', ');
        const values = Object.values(toptechnologies);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const { rows } = await pool.query(
            `INSERT INTO toptechnologies (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return rows[0];
    },

    updateTechnology: async (id, toptechnologies) => {
        const filteredData = Object.entries(toptechnologies).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value;
          }
          return acc;
        }, {});
        if (Object.keys(filteredData).length === 0) {
          throw new Error("No valid fields provided for update");
        }
      
        const setClause = Object.keys(filteredData)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(', ');
        
        const values = Object.values(filteredData);
        values.push(id);
      
        const query = {
          text: `UPDATE toptechnologies SET ${setClause} WHERE id = $${values.length} RETURNING *`,
          values: values,
        };
      
        const { rows } = await pool.query(query);
        return rows[0];
      },

    deleteTechnologies: async (id) => {
        const { rowCount } = await pool.query(`DELETE FROM toptechnologies WHERE id = $1`, [id]);
        return rowCount > 0;
    },
};

module.exports = TopTechnologies;
