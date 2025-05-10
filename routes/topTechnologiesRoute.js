const express = require("express");
const path = require('path');
const multer = require("multer");
const TopTechnologiesController = require("../controllers/topTechnologiesController");

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
  "/all-technologies",
 TopTechnologiesController.getAllTechnologies
);
router.get("/:id", TopTechnologiesController.getTechnologyById);
router.put(
  "/:id", 
  upload.single("image"), 
  TopTechnologiesController.updateTechnology
);
router.post(
  "/",
  upload.single("image"),
  TopTechnologiesController.createTechnologies
);
router.delete("/:id", TopTechnologiesController.deleteTechnologies);

module.exports = router;