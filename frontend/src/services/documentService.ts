import { api } from '../lib/api';
import { Document } from '../types';

export const documentService = {
  getEmployeeDocuments: async (employeeProfileId: string) => {
    const res = await api.get<Document[]>(`/documents/employee/${employeeProfileId}`);
    return res.data;
  },

  uploadDocument: async (employeeProfileId: string, file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    const res = await api.post<Document>(`/documents/employee/${employeeProfileId}`, formData);
    return res.data;
  },

  getDownloadUrl: (documentId: string) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${API_BASE_URL}/documents/${documentId}/download`;
  },
};
