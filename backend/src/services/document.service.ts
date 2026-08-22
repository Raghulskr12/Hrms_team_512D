import { DocumentRepository } from '../repositories/document.repository';
import { EmployeeRepository } from '../repositories/employee.repository';

export class DocumentService {
  static async getEmployeeDocuments(employeeProfileId: string, requestingUserId: string, requestingUserRole: string) {
    const profile = await EmployeeRepository.findById(employeeProfileId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    if (profile.userId !== requestingUserId && requestingUserRole !== 'ADMIN' && requestingUserRole !== 'HR') {
      throw { statusCode: 403, message: 'Unauthorized to view these documents' };
    }

    return DocumentRepository.findByEmployeeId(profile.id);
  }

  static async uploadDocument(data: {
    employeeProfileId: string;
    title: string;
    fileName: string;
    fileType: string;
    filePath: string;
  }) {
    const profile = await EmployeeRepository.findById(data.employeeProfileId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    return DocumentRepository.create({
      employeeId: profile.id,
      title: data.title,
      fileName: data.fileName,
      fileType: data.fileType,
      filePath: data.filePath,
    });
  }

  static async getDocumentForDownload(documentId: string, requestingUserId: string, requestingUserRole: string) {
    const doc = await DocumentRepository.findById(documentId);
    if (!doc) {
      throw { statusCode: 404, message: 'Document not found' };
    }

    const profile = await EmployeeRepository.findById(doc.employeeId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    if (profile.userId !== requestingUserId && requestingUserRole !== 'ADMIN' && requestingUserRole !== 'HR') {
      throw { statusCode: 403, message: 'Unauthorized access to this document' };
    }

    return doc;
  }
}
