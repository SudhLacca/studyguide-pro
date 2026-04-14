import { useState } from 'react';
import { FileText, Download, Printer, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // <-- ADDED: For Tables and advanced markdown
import { useStudyContext } from '../context/StudyContext';
import api from '../api';

export default function DetailedNotes() {
  const { globalDocumentName: documentName, setGlobalDocumentName: setDocumentName } = useStudyContext();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!documentName) {
      setError('Please enter a document name.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/generate-notes', { document_name: documentName });
      setNotes(response.data.notes);
    } catch (err) {
      // If the backend hits a rate limit or crashes, this catches it!
      setError('Failed to generate notes. Please check the document name or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      // Send the markdown to the backend to get a DOCX file
      const response = await api.post('/export-docx', 
        { notes_content: notes },
        { responseType: 'blob' } // CRITICAL: Tell Axios we are downloading a file
      );
      
      // Create a hidden link to trigger the file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Study_Notes.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download DOCX.');
    }
  };

  const handlePrintPdf = () => {
    // Native browser print dialog allows saving directly as PDF perfectly
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION (Hidden during PDF Print) */}
      <div className="print:hidden">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Detailed Notes</h1>
        </div>
        <p className="text-slate-400">Generate, view, and export comprehensive study notes.</p>
      </div>

      {/* CONTROL PANEL (Hidden during PDF Print) */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:hidden">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., biology_chapter_1.pdf"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              {isLoading ? 'Generating...' : 'Generate Notes'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* NOTES DISPLAY AREA */}
      {notes && (
        <div className="space-y-4">
          {/* Action Buttons (Hidden during Print) */}
          <div className="flex justify-end gap-3 print:hidden">
            <button onClick={handlePrintPdf} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600">
              <Printer className="w-4 h-4" /> Save as PDF
            </button>
            <button onClick={handleDownloadDocx} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Download DOCX
            </button>
          </div>

          {/* The Actual Notes Document */}
          <div className="bg-white p-10 rounded-xl shadow-lg text-slate-900 print:p-0 print:shadow-none print:bg-transparent min-h-[500px] print:w-full print:block">
            {/* UPDATED: Extensive Tailwind prose classes for a premium Notion-like aesthetic */}
            <div className="prose max-w-none prose-lg print:prose-base prose-headings:text-indigo-900 prose-headings:border-b prose-headings:pb-2 prose-p:mb-6 prose-li:mb-2 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-table:w-full prose-table:border-collapse prose-th:bg-slate-100 prose-th:p-3 prose-th:border prose-th:border-slate-300 prose-td:p-3 prose-td:border prose-td:border-slate-300 print:text-black">
              {/* UPDATED: Added remarkPlugins to support GitHub Flavored Markdown (tables, etc.) */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {notes}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}