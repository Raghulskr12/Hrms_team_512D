import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { DocumentController } from '../controllers/document.controller';
import { requireAuth } from '../middleware/auth.middleware';

const uploadsDir = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.get('/employee/:employeeId', requireAuth, DocumentController.getEmployeeDocuments);
router.post('/employee/:employeeId', requireAuth, upload.single('file'), DocumentController.uploadDocument);
router.get('/:id/download', requireAuth, DocumentController.downloadDocument);

export default router;
