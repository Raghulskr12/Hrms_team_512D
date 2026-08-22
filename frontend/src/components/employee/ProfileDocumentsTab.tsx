'use client';

import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import { documentService } from '../../services/documentService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FileText, Download, Upload, Plus } from 'lucide-react';

interface ProfileDocumentsTabProps {
  employeeProfileId: string;
}

export const ProfileDocumentsTab: React.FC<ProfileDocumentsTabProps> = ({ employeeProfileId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await documentService.getEmployeeDocuments(employeeProfileId);
      setDocuments(data || []);
    } catch (e: any) {
      setError(e.message || 'Unable to load employee documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [employeeProfileId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      await documentService.uploadDocument(employeeProfileId, selectedFile, title);
      setTitle('');
      setSelectedFile(null);
      setShowUploadForm(false);
      fetchDocs();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100">Employee Documents & Verification</h3>
        <Button variant="primary" size="sm" onClick={() => setShowUploadForm(!showUploadForm)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Upload Document
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {showUploadForm && (
        <form onSubmit={handleUpload} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <Input
            label="Document Title (e.g. Passport, Offer Letter)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">File Attachment</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-950 file:text-purple-300 hover:file:bg-purple-900"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowUploadForm(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={uploading}>
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Now
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading documents...</div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2.5 bg-purple-950/60 text-purple-400 rounded-lg border border-purple-800/40 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-200 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {doc.fileName} • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <a
                href={documentService.getDownloadUrl(doc.id)}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400">
          No documents uploaded yet.
        </div>
      )}
    </div>
  );
};
