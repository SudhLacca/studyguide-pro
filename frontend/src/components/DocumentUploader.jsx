import { useState } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';

export default function DocumentUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send to FastAPI backend
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setStatus('success');
      if (onUploadSuccess) {
        onUploadSuccess(response.data.filename);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Failed to process document');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Upload Study Material</h3>
        <p className="text-slate-400 text-sm">Upload your PDF or DOCX notes to start generating guides.</p>
      </div>

      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:bg-slate-700/30 transition-colors relative">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={status === 'uploading'}
        />
        
        {status === 'idle' && !file && (
          <div className="flex flex-col items-center">
            <UploadCloud className="w-12 h-12 text-indigo-400 mb-3" />
            <span className="text-slate-300 font-medium">Click or drag file to this area</span>
            <span className="text-slate-500 text-sm mt-1">PDF, DOCX, or TXT up to 10MB</span>
          </div>
        )}

        {file && status !== 'success' && (
          <div className="flex flex-col items-center">
            <FileType className="w-12 h-12 text-emerald-400 mb-3" />
            <span className="text-white font-medium">{file.name}</span>
            <span className="text-slate-400 text-sm mt-1">Ready to process</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
            <span className="text-emerald-400 font-medium">Document Processed Successfully!</span>
            <span className="text-slate-400 text-sm mt-1">{file.name} is now ready for AI analysis.</span>
          </div>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {file && status !== 'success' && (
        <button
          onClick={handleUpload}
          disabled={status === 'uploading'}
          className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Document...
            </>
          ) : (
            'Process with AI'
          )}
        </button>
      )}
    </div>
  );
}