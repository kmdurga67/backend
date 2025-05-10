const TopTechnologiesModel = require("../models/topTechnologies");

const TopTechnologiesController = {
  getAllTechnologies: async (req, res) => {
    try {
      const technologies = await TopTechnologiesModel.getAllTechologies();
      res.json(technologies);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getTechnologyById: async (req, res) => {
    const { id } = req.params;
    try {
      const technologies = await TopTechnologiesModel.getTechnologyById(id);
      if (technologies) {
        res.json(technologies);
      } else {
        res.status(404).json({ error: 'Technologies not found' });
      }
    } catch (err) {
      console.error('Error fetching technologies:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createTechnologies: async (req, res) => {
    try {
      const technologiesData = req.body;
      if (req.file) {
        technologiesData.image = req.file.filename;
      }

      console.log(technologiesData)

      const newTechnologies = await TopTechnologiesModel.createTechnologies(technologiesData);
      res.status(201).json(newTechnologies);
    } catch (err) {
      console.error('Error creating technologies:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateTechnology: async (req, res) => {
    const { id } = req.params;
    try {
      const technologiesData = req.body;
      
      if (req.file) {
        technologiesData.image = req.file.filename;
      }
  
      const updatedTechnologies = await TopTechnologiesModel.updateTechnology(id, technologiesData);
      
      if (updatedTechnologies) {
        res.json(updatedTechnologies);
      } else {
        res.status(404).json({ error: 'technologies not found' });
      }
    } catch (err) {
      console.error('Error updating technologies:', err);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
      });
    }
  },

  deleteTechnologies: async (req, res) => {
    const { id } = req.params;
    try {
      const isDeleted = await TopTechnologiesModel.deleteTechnologies(id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'technologies not found' });
      }
    } catch (err) {
      console.error('Error deleting technologies:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = TopTechnologiesController;