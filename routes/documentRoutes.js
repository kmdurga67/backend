const express = require('express');
const multer = require('multer');
const path = require('path');
const DocumentController = require('../controllers/documentController');
const authAdmin = require('../middleware/authMiddleware');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({ storage: storage })

router.get('/all-documents', authAdmin, DocumentController.getAllDocuments);
router.get('/:accession_no', authAdmin, DocumentController.getDocumentByTitle);
router.post("/", authAdmin, upload.single('file_path'), DocumentController.createDocument);
router.put('/:accession_no', authAdmin, upload.single('file_path'), DocumentController.updateDoucment);
router.delete('/:accession_no', authAdmin, DocumentController.deleteDocument);
router.get('/metadata', authAdmin, DocumentController.getDocumentMetadata);

module.exports = router;