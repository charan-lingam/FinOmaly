import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--border-radius)', fontFamily: 'sans-serif' }}>
      <form
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        style={{ position: 'relative' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '160px',
            borderRadius: '8px',
            border: dragActive ? '2px dashed var(--blue)' : '2px dashed var(--border)',
            backgroundColor: dragActive ? 'var(--blue-light)' : 'var(--main-bg)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={onButtonClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud
            size={32}
            style={{ marginBottom: '12px', color: dragActive ? 'var(--blue)' : 'var(--text-muted)' }}
          />
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
            Drag & drop CSV or <span style={{ color: 'var(--blue)' }}>Browse</span>
          </p>
        </div>
      </form>

      {file && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>Selected File</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: 'var(--main-bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '6px', backgroundColor: '#fff', borderRadius: '4px', color: 'var(--blue)', border: '1px solid var(--border)' }}>
                <FileIcon size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatSize(file.size)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
