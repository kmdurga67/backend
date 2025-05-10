const express = require("express");
const ArtifactController = require("../controllers/artifactController");
const DocumentController = require("../controllers/documentController");
const VisitorController = require("../controllers/visitorsController");

const router = express.Router();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

router.get("/user-artifacts",ArtifactController.getAllArtifacts);
router.get("/user-artifacts/:id", ArtifactController.getArtifactById);
router.get("/user-documents", DocumentController.getAllDocuments);
router.get("/user-documents/:id", DocumentController.getDocumentByTitle);
router.get("/user-visitors", VisitorController.getAllVisitorData);
router.get("/user-visitors/:id", VisitorController.getVisitorById);


module.exports = router;
