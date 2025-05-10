const express = require("express");
const path = require('path');
const multer = require("multer");
const ArtifactController = require("../controllers/artifactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get(
  "/all-artifacts",
  authMiddleware,
  ArtifactController.getAllArtifacts
);
router.get("/:id", authMiddleware, ArtifactController.getArtifactById);
router.put(
  "/:id", 
  authMiddleware,
  upload.single("file_path"), 
  ArtifactController.updateArtifact
);
router.post(
  "/",
  authMiddleware,
  upload.single("file_path"),
  ArtifactController.createArtifact
);
router.delete("/:id", authMiddleware, ArtifactController.deleteArtifact);

module.exports = router;