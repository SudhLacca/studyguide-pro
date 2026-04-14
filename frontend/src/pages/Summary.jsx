import { useState } from 'react';
import { FileText, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';

export default function Summary() {
  // State for our form inputs
  const [documentName, setDocumentName] = useState('');
  const [focusArea, setFocusArea] = useState('');
  
  // State for the API response
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!documentName) {
      setError('Please enter the name of the document you uploaded.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      // Make the call to your FastAPI /api/summary endpoint
      const response = await api.post('/summary', {
        document_name: documentName,
        focus_area: focusArea || null, // Send null if the user left it blank
      });

      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary. Make sure the document name is exactly what you uploaded.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-700 pb-5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          Document Summary
        </h1>
        <p className="mt-2 text-slate-400">
          Generate a concise, intelligent summary of your uploaded study materials.
        </p>
      </div>

      {/* Control Panel (The Form) */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
        <form onSubmit={handleGenerateSummary} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Document Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Target Document Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., biology_notes.pdf"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Must match the exact filename you uploaded.</p>
            </div>

            {/* Focus Area Input (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Specific Focus (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Only focus on the definitions"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !documentName}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Summary
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Display Area */}
      {summary && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-lg mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
            AI Generated Summary
          </h2>
          <div className="prose prose-invert max-w-none">
            {/* We split the text by newlines so paragraph breaks show up correctly.
              In a full production app, you might use a library like 'react-markdown' here!
            */}
            {summary.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-300 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}