import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { DocumentService } from '../services/document.service';
import { sendSuccess, sendError } from '../utils/response';
import path from 'path';
import fs from 'fs';

export class DocumentController {
  static async getEmployeeDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const employeeProfileId = req.params.employeeId;
      const documents = await DocumentService.getEmployeeDocuments(employeeProfileId, req.user!.userId, req.user!.role);
      return sendSuccess(res, 200, 'Documents retrieved', documents);
    } catch (error) {
      return next(error);
    }
  }

  static async uploadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const employeeProfileId = req.params.employeeId;
      const file = req.file;
      const title = req.body.title || file?.originalname || 'Document';

      if (!file) {
        return sendError(res, 400, 'No file uploaded');
      }

      const doc = await DocumentService.uploadDocument({
        employeeProfileId,
        title,
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: file.path,
      });

      return sendSuccess(res, 201, 'Document uploaded successfully', doc);
    } catch (error) {
      return next(error);
    }
  }

  static async downloadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id;
      const doc = await DocumentService.getDocumentForDownload(documentId, req.user!.userId, req.user!.role);

      const absolutePath = path.resolve(doc.filePath);
      if (!fs.existsSync(absolutePath)) {
        return sendError(res, 404, 'Physical document file not found on server');
      }

      res.setHeader('Content-Type', doc.fileType);
      res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
      return res.sendFile(absolutePath);
    } catch (error) {
      return next(error);
    }
  }
}
