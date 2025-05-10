const pool = require('../config/database');

const DocumentModel = {
    getDocumentMetadata: async () => {
        const { rows } = await pool.query(`
            SELECT 
                title, 
                author, 
                subject, 
                publisher, 
                publisher_place, 
                copyrights, 
                name_of_publisher 
            FROM documents
        `);
        return rows;
    },

    getAllDocuments: async () => {
        const { rows } = await pool.query(`SELECT * FROM documents`);
        return rows;
    },

    getAllUserDocuments: async () => {
        const { rows } = await pool.query(`SELECT * FROM documents WHERE is_private = false`);
        return rows;
    },

    getDocumentByTitle: async (id) => {
        const { rows } = await pool.query(`SELECT * FROM documents WHERE accession_no = $1`, [id]);
        return rows[0];
    },

    getUserDocumentByTitle: async (id) => {
        const { rows } = await pool.query(`SELECT * FROM documents WHERE is_private = false AND accession_no = $1`, [id]);
        return rows[0];
    },

    createDocument: async (documentData) => {
        const columns = Object.keys(documentData).join(',');
        const values = Object.values(documentData);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const { rows } = await pool.query(
            `INSERT INTO documents (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        return rows[0];
    },

    // updateDocument: async (id, documentData) => {
    //     const setClause = Object.keys(documentData)
    //         .map((key, index) => `${key} = $${index + 1}`)
    //         .join(', ');

    //     const values = Object.values(documentData);
    //     values.push(id);

    //     const { rows } = await pool.query(
    //         `UPDATE documents
    //    SET ${setClause} 
    //    WHERE id = $${values.length} 
    //    RETURNING *`,
    //         values
    //     );
    //     return rows[0];
    // },

    updateDoucment: async (accession_no, documentData) => {
        const filteredData = Object.entries(documentData).reduce((acc, [key, value]) => {
            if(value !== undefined && value !== null){
                acc[key] = value;
            }
            return acc;
        }, {});
        if (Object.keys(filteredData).length === 0){
            throw new Error("No valid fields provided for update of document");
        } 

        const setClause = Object.keys(documentData).map((key, index) =>    `${key} = $${index + 1}`)
        .join(', ');

        const values = Object.values(documentData);
        values.push(accession_no);

        const query = {
            text : `UPDATE documents SET ${setClause} WHERE accession_no = $${values.length} RETURNING *`,
            values: values,
        }

        const { rows }  = await pool.query(query);
        return rows[0];
    },

    deleteDocument: async (accession_no) => {
        const { rowCount } = await pool.query(`DELETE FROM documents WHERE  accession_no= $1`, [accession_no]);
        return rowCount > 0;
    },
};

module.exports = DocumentModel;