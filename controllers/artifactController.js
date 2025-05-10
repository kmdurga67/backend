const ArtifactModel = require('../models/artifactModel');

const ArtifactController = {
  getAllArtifacts: async (req, res) => {
    try {
      const artifacts = await ArtifactModel.getAllArtifacts();
      res.json(artifacts);
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getArtifactById: async (req, res) => {
    const { id } = req.params;
    try {
      const artifact = await ArtifactModel.getArtifactById(id);
      if (artifact) {
        res.json(artifact);
      } else {
        res.status(404).json({ error: 'Artifact not found' });
      }
    } catch (err) {
      console.error('Error fetching artifact:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createArtifact: async (req, res) => {
    try {
      const artifactData = req.body;
      if (req.file) {
        artifactData.file_path = req.file.filename;
      }

      console.log(artifactData)

      const newArtifact = await ArtifactModel.createArtifact(artifactData);
      res.status(201).json(newArtifact);
    } catch (err) {
      console.error('Error creating artifact:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateArtifact: async (req, res) => {
    const { id } = req.params;
    try {
      const artifactData = req.body;
      
      if (req.file) {
        artifactData.file_path = req.file.filename;
      }
      if (artifactData.year) artifactData.year = Number(artifactData.year);
      if (artifactData.length) artifactData.length = Number(artifactData.length);
      if (artifactData.width) artifactData.width = Number(artifactData.width);
  
      const updatedArtifact = await ArtifactModel.updateArtifact(id, artifactData);
      
      if (updatedArtifact) {
        res.json(updatedArtifact);
      } else {
        res.status(404).json({ error: 'Artifact not found' });
      }
    } catch (err) {
      console.error('Error updating artifact:', err);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
      });
    }
  },

  deleteArtifact: async (req, res) => {
    const { id } = req.params;
    try {
      const isDeleted = await ArtifactModel.deleteArtifact(id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Artifact not found' });
      }
    } catch (err) {
      console.error('Error deleting artifact:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = ArtifactController;