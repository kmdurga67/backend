const pool = require('../config/database');

const ArtifactModel = {
    getAllArtifacts: async () => {
        const { rows } = await pool.query(`SELECT * FROM artifacts`);
        return rows;
    },

    getArtifactById: async (id) => {
        const { rows } = await pool.query(`SELECT * FROM artifacts WHERE id = $1`, [id]);
        return rows[0];
    },

    createArtifact: async (artifactData) => {
        const columns = Object.keys(artifactData).join(', ');
        const values = Object.values(artifactData);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const { rows } = await pool.query(
            `INSERT INTO artifacts (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return rows[0];
    },

    updateArtifact: async (id, artifactData) => {
        const filteredData = Object.entries(artifactData).reduce((acc, [key, value]) => {
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
          text: `UPDATE artifacts SET ${setClause} WHERE id = $${values.length} RETURNING *`,
          values: values,
        };
      
        const { rows } = await pool.query(query);
        return rows[0];
      },

    deleteArtifact: async (id) => {
        const { rowCount } = await pool.query(`DELETE FROM artifacts WHERE id = $1`, [id]);
        return rowCount > 0;
    },
};

module.exports = ArtifactModel;
