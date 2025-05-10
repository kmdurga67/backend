const DocumentModel = require('../models/documnetModel');

const DocumentController = {
    getDocumentMetadata: async (req, res) => {
        try {
            const metadata = await DocumentModel.getDocumentMetadata();
            res.json(metadata);
        } catch (err) {
            console.error('Error fetching document metadata:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllDocuments: async (req, res) => {
        try {
            const documents = await DocumentModel.getAllDocuments();
            res.json(documents);
        } catch (err) {
            console.error('Error fetching documents:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllUserDocuments: async (req, res) => {
        try {
            const documents = await DocumentModel.getAllUserDocuments();
            res.json(documents);
        } catch (err) {
            console.error('Error fetching documents:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getDocumentByTitle: async (req, res) => {
        const { accession_no } = req.params;
        try {
            const document = await DocumentModel.getDocumentByTitle(accession_no);
            if (document) {
                res.json(document);
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } catch (err) {
            console.error('Error fetching document:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserDocumentByTitle: async (req, res) => {
        const { accession_no } = req.params;
        try {
            const document = await DocumentModel.getUserDocumentByTitle(accession_no);
            if (document) {
                res.json(document);
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } catch (err) {
            console.error('Error fetching document:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createDocument: async (req, res) => {
        try {
            let documentData = req.body;
            if (req.file) {
                documentData.file_path = req.file.filename;
            }

            console.log(req.file);
            console.log(documentData);

            const newDocument = await DocumentModel.createDocument(documentData);
            res.status(201).json(newDocument);
        } catch (err) {
            console.error('Error creating document:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateDoucment: async (req, res) => {
        const { accession_no } = req.params;

        try {
            const documentData = req.body;

            if (req.file) {
                documentData.file_path = req.file.filename
            }

            if (documentData.year) documentData.year = Number(documentData.year);


            const updateDocument = await DocumentModel.updateDoucment(accession_no, documentData);

            if (updateDocument) {
                res.json(documentData);
                console.log("Updated Document Data",documentData)
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } catch (error) {
            console.error('Error updating document:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    },

    deleteDocument: async (req, res) => {
        const { accession_no } = req.params;
        try {
            const isDeleted = await DocumentModel.deleteDocument(accession_no);
            if (isDeleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } catch (err) {
            console.error('Error deleting document:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = DocumentController;
