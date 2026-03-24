import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  label: string;
  instruction: string;
  accept: string;
  maxSizeKB: number;
  maxFiles?: number;
  files: File | File[] | null;
  onFilesChange: (files: File | File[] | null) => void;
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  instruction,
  accept,
  maxSizeKB,
  maxFiles = 1,
  files,
  onFilesChange,
  multiple = false,
}) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [maxSizeKB, maxFiles, multiple]
  );

  const processFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      (f) => f.size <= maxSizeKB * 1024
    );
    if (multiple) {
      const limited = validFiles.slice(0, maxFiles);
      onFilesChange(limited);
    } else {
      onFilesChange(validFiles[0] || null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index?: number) => {
    if (multiple && Array.isArray(files) && index !== undefined) {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onFilesChange(null);
    }
  };

  const fileList = multiple
    ? (Array.isArray(files) ? files : [])
    : (files && !Array.isArray(files) ? [files] : []);

  const maxSizeLabel = maxSizeKB >= 1024 ? `${(maxSizeKB / 1024).toFixed(1)} MB` : `${maxSizeKB.toFixed(1)} KB`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <p className="text-xs text-muted-foreground">{instruction}</p>
      <div
        className={cn('file-dropzone', dragActive && 'file-dropzone-active')}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-${label.replace(/\s/g, '')}`)?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">Max {maxSizeLabel}</p>
        <input
          id={`file-${label.replace(/\s/g, '')}`}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {fileList.length > 0 && (
        <div className="space-y-1">
          {fileList.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
              <span className="truncate text-foreground">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(multiple ? i : undefined); }}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
