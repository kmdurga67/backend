const express = require('express');
const path = require('path');
const multer = require('multer');
const VisitorController = require('../controllers/visitorsController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/all-visitors", authMiddleware, VisitorController.getAllVisitorData);

router.get("/:id", authMiddleware, VisitorController.getVisitorById);
router.put("/:id", authMiddleware, upload.array("file_path", 10), VisitorController.updateVisitor);
router.post("/", authMiddleware, upload.array("file_path", 10), VisitorController.createVisitor);
router.delete("/:id", authMiddleware, VisitorController.deleteVisitor);

module.exports = router;