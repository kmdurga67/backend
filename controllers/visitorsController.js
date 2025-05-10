const VisitorModel = require('../models/visitorModel');

const VisitorController = {
    getAllVisitorData: async (req, res) => {
        try {
            const visitors = await VisitorModel.getAllVisitorsData();
            res.json(visitors)
        } catch (error) {
            console.log('Error Fetching visitors:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getVisitorById: async (req, res) => {
        const { id } = req.params;
        try {
            const visitor = await VisitorModel.getVisitorsById(id);
            if (visitor) {
                res.json(visitor);
            } else {
                res.status(404).json({ error: 'Visitor not found' });
            }
        } catch (error) {
            console.error('Error fetching visitor:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createVisitor: async (req, res) => {
        try {
            const visitorData = req.body;
            
            if (req.files && req.files.length > 0) {
                visitorData.file_path = req.files.map(file => file.filename);
            }
    
            const newVisitor = await VisitorModel.createVisitors(visitorData);
            res.status(201).json(newVisitor);
            console.log(newVisitor)
        } catch (error) {
            console.error('Error creating visitor:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    updateVisitor: async (req, res) => {
        const { id } = req.params;
        try {
            const visitorData = req.body;
    
            if (req.files && req.files.length > 0) {
                visitorData.file_path = req.files.map(file => file.filename);
            }
    
            const updateVisitor = await VisitorModel.updateVisitor(id, visitorData);
            if (updateVisitor) {
                res.json(updateVisitor);
            } else {
                res.status(404).json({ error: 'Visitor Not Found' });
            }
        } catch (error) {
            console.error("Error updating visitor", error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    },

    deleteVisitor: async (req, res) => {
        const { id } = req.params;
        try {
            const isDeleted = await VisitorModel.deleteVisitor(id);
            if (isDeleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Visitor Not Found' });
            }
        } catch (err) {
            console.error('Error deleting visitor:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};


module.exports = VisitorController;