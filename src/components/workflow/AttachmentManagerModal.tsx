import React, { useState } from 'react';
import { 
  Paperclip, X, UploadCloud, FileText, Image, Film, Music, Archive, Code, 
  Trash2, CheckCircle2, Loader2, CloudCheck, ExternalLink 
} from 'lucide-react';
import { WorkflowAttachment } from './workflowTypes';

interface AttachmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId?: string;
  attachments: WorkflowAttachment[];
  onAddAttachments: (newFiles: WorkflowAttachment[]) => void;
  onRemoveAttachment: (fileId: string) => void;
}

export default function AttachmentManagerModal({
  isOpen,
  onClose,
  nodeId,
  attachments,
  onAddAttachments,
  onRemoveAttachment
}: AttachmentManagerModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (filesList: FileList | File[]) => {
    setUploading(true);
    setTimeout(() => {
      const newItems: WorkflowAttachment[] = Array.from(filesList).map((f, i) => {
        let typeExt: WorkflowAttachment['fileType'] = 'pdf';
        const nameLower = f.name.toLowerCase();
        if (nameLower.endsWith('.pdf')) typeExt = 'pdf';
        else if (nameLower.endsWith('.docx') || nameLower.endsWith('.doc')) typeExt = 'docx';
        else if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) typeExt = 'xlsx';
        else if (nameLower.endsWith('.csv')) typeExt = 'csv';
        else if (nameLower.endsWith('.png') || nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg')) typeExt = 'image';
        else if (nameLower.endsWith('.mp4') || nameLower.endsWith('.mov')) typeExt = 'video';
        else if (nameLower.endsWith('.mp3') || nameLower.endsWith('.wav')) typeExt = 'audio';
        else if (nameLower.endsWith('.zip') || nameLower.endsWith('.tar')) typeExt = 'zip';
        else if (nameLower.endsWith('.ts') || nameLower.endsWith('.js') || nameLower.endsWith('.py')) typeExt = 'code';

        return {
          id: `file-${Date.now()}-${i}`,
          name: f.name,
          size: f.size || 124500,
          type: f.type || 'application/octet-stream',
          fileType: typeExt,
          uploadedAt: new Date().toLocaleTimeString(),
          syncStatus: 'synced'
        };
      });

      onAddAttachments(newItems);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Node Attachment Manager</h3>
              <p className="text-xs text-[#94A3B8]">Multi-format file upload and vector knowledge store sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleSimulatedFileUpload(e.dataTransfer.files);
          }}
          className={`p-8 border-2 border-dashed rounded-2xl text-center space-y-3 transition-all cursor-pointer ${
            isDragging
              ? 'border-[#00D4FF] bg-[#00D4FF]/10'
              : 'border-white/[0.15] bg-[#131A2E]/50 hover:border-[#00D4FF]/50'
          }`}
        >
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleSimulatedFileUpload(e.target.files)}
            className="hidden"
            id="file-upload-input"
          />
          <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin mx-auto" />
            ) : (
              <UploadCloud className="w-10 h-10 text-[#00D4FF] mx-auto" />
            )}
            <p className="text-sm font-bold text-[#F8FAFC]">
              {uploading ? 'Processing & Chunking Documents...' : 'Click to Upload or Drag & Drop Files'}
            </p>
            <p className="text-xs text-[#94A3B8]">
              Supports PDF, Word (DOCX), Excel (XLSX), CSV, ZIP, Code, Images, Audio & Video
            </p>
          </label>
        </div>

        {/* File Attachments List */}
        <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
          {attachments.length > 0 ? (
            attachments.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-2xl bg-[#131A2E]/80 border border-white/[0.08] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#F8FAFC] truncate">{file.name}</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono">
                      {(file.size / 1024).toFixed(1)} KB • {file.fileType.toUpperCase()} • {file.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cloud Synced</span>
                  </span>

                  <button
                    onClick={() => onRemoveAttachment(file.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-[#94A3B8] py-4">No attachments uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
