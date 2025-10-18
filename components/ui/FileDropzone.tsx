import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloudIcon, CheckCircleIcon } from './Icons';
import { getFileType } from '../../utils/fileUtils';

interface FileDropzoneProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  helpText?: string;
  showImagePreview?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  file,
  onFileChange,
  accept,
  disabled,
  helpText,
  showImagePreview = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && showImagePreview && getFileType(file.name) === 'image') {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [file, showImagePreview]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const baseClasses = "relative block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 group";
  const stateClasses = isDragging
    ? "border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/20"
    : "border-slate-400/50 dark:border-white/20 bg-black/5 dark:bg-black/10 hover:border-sky-400/50 hover:bg-sky-500/10";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <div
            className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
        >
            <input
            id={`file-upload-${label}`}
            name={`file-upload-${label}`}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            />
            {file ? (
                <div className="flex items-center justify-center text-sm text-slate-800 dark:text-slate-100">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                    ) : (
                      <CheckCircleIcon className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mr-3 flex-shrink-0" />
                    )}
                    <div className="text-left min-w-0">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
            ) : (
                <div className="text-slate-500 dark:text-slate-400">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                    <p className="mt-2 text-sm">
                    Drag & drop or <span className="font-semibold text-sky-600 dark:text-sky-400">browse</span>
                    </p>
                    {helpText && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{helpText}</p>}
                </div>
            )}
        </div>
    </div>
  );
};