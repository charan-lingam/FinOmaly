import * as React from "react";
import { UploadCloud, X, File as FileIcon, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "../../lib/utils"; // Adjusted for relative path
import { Button } from "./button"; // Adjusted for relative path
import { Progress } from "./progress"; // Adjusted for relative path

// Define the structure for a file being uploaded
export interface UploadedFile {
  id: string;
  file: File;
  progress: number; // 0-100
  status: "pending" | "uploading" | "completed" | "error";
}

// Define the props for the component
interface FileUploadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  files: UploadedFile[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onClose?: () => void;
}

export const FileUploadCard = React.forwardRef<HTMLDivElement, FileUploadCardProps>(
  ({ className, files = [], onFilesChange, onFileRemove, onClose, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Handler for drag enter event
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    // Handler for drag leave event
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    // Handler for drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Handler for drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles && droppedFiles.length > 0) {
        onFilesChange(droppedFiles);
      }
    };

    // Handler for file input change
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesChange(selectedFiles);
      }
    };

    // Trigger file input click
    const triggerFileSelect = () => fileInputRef.current?.click();

    // Format file size for display
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 KB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    
    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };
    
    const fileItemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    };

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full max-w-lg bg-background rounded-xl border shadow-sm",
          className
        )}
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        {...props}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted" style={{ backgroundColor: 'var(--main-bg)' }}>
                <UploadCloud className="w-6 h-6 text-muted-foreground" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground" style={{ color: 'var(--text-primary)' }}>Upload files</h3>
                <p className="text-sm text-muted-foreground mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Select and upload the files of your choice
                </p>
              </div>
            </div>
            {onClose && (
               <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                 <X className="w-4 h-4" />
               </Button>
            )}
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={cn(
              "mt-6 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors duration-200 cursor-pointer"
            )}
            style={{ 
              borderColor: isDragging ? 'var(--blue)' : 'var(--border)',
              backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent' 
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="font-semibold text-foreground" style={{ color: 'var(--text-primary)' }}>Choose a file or drag & drop it here.</p>
            <p className="text-xs text-muted-foreground mt-1" style={{ color: 'var(--text-secondary)' }}>
              CSV formats, up to 50 MB.
            </p>
            <Button variant="outline" size="sm" className="mt-4 pointer-events-none" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}>
              Browse File
            </Button>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="p-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <ul className="space-y-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.li
                    key={file.id}
                    variants={fileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-muted)' }}>
                        {file.file.type.split("/")[1]?.toUpperCase().substring(0, 3) || "CSV"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-xs" style={{ color: 'var(--text-primary)' }}>{file.file.name}</p>
                        <div className="text-xs text-muted-foreground" style={{ color: 'var(--text-secondary)' }}>
                          {file.status === "uploading" && (
                            <span>{formatFileSize((file.file.size * file.progress) / 100)} of {formatFileSize(file.file.size)}</span>
                          )}
                           {file.status === "completed" && (
                            <span>{formatFileSize(file.file.size)}</span>
                          )}
                          <span className="mx-1">•</span>
                          <span className={cn(
                             {"text-primary": file.status === 'uploading'},
                             {"text-green-500": file.status === 'completed'},
                             {"text-muted-foreground": file.status === 'pending'},
                             {"text-red-500": file.status === 'error'},
                          )} style={{ color: file.status === 'completed' ? 'var(--green)' : file.status === 'error' ? 'var(--red)' : file.status === 'pending' ? 'var(--text-secondary)' : 'var(--blue)' }}>
                            {file.status === 'uploading' ? `Uploading...` : file.status === 'completed' ? 'Completed' : file.status === 'error' ? 'Error' : 'Pending'}
                          </span>
                        </div>
                        {file.status === 'uploading' && <Progress value={file.progress} className="h-1.5 mt-1" style={{ backgroundColor: 'var(--border)' }} />}
                      </div>
                    </div>
                    
                     <div className="flex items-center gap-2">
                        {file.status === 'completed' && <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--green)' }} />}
                        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={() => onFileRemove(file.id)} style={{ color: 'var(--text-secondary)' }}>
                           {file.status === 'completed' ? <Trash2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </Button>
                     </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </motion.div>
    );
  }
);
FileUploadCard.displayName = "FileUploadCard";
