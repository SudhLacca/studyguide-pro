import { useState } from 'react';
import { Wand2, Sparkles, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../api';

export default function Simplify() {
  const [documentName, setDocumentName] = useState('');
  const [textToSimplify, setTextToSimplify] = useState('');
  const [targetAudience, setTargetAudience] = useState('a high school student');
  
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimplify = async (e) => {
    e.preventDefault();
    if (!documentName || !textToSimplify) {
      setError('Please provide both a document name and the text you want to simplify.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSimplifiedText('');

    try {
      const response = await api.post('/simplify', {
        document_name: documentName,
        text_to_simplify: textToSimplify,
        target_audience: targetAudience
      });
      
      setSimplifiedText(response.data.simplified_text);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to simplify the concept.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Wand2 className="w-8 h-8 text-pink-400" />
          Concept Simplifier
        </h1>
        <p className="mt-2 text-slate-400">
          Stuck on a complex paragraph? Let the AI break it down into easy-to-understand terms.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
        <form onSubmit={handleSimplify} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., chemistry_ch3.pdf"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Explain it to me like I am...</label>
              <select
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              >
                <option value="a 5-year-old">A 5-year-old (Extremely Simple)</option>
                <option value="a middle schooler">A Middle Schooler (Basic concepts)</option>
                <option value="a high school student">A High School Student (Clear & concise)</option>
                <option value="a college freshman">A College Freshman (Academic but accessible)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Complex Text to Simplify *</label>
            <textarea
              required
              rows="4"
              placeholder="Paste the confusing paragraph or concept from your notes here..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none custom-scrollbar"
              value={textToSimplify}
              onChange={(e) => setTextToSimplify(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !documentName || !textToSimplify}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Simplifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Simplify Concept
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      {simplifiedText && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Original Text (For Comparison) */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 opacity-75">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Original Academic Text
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">
              "{textToSimplify}"
            </p>
          </div>

          {/* Simplified Output */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-pink-500/30 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Wand2 className="w-24 h-24 text-pink-500" />
            </div>
            
            <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Simplified Translation
            </h3>
            <div className="prose prose-invert max-w-none relative z-10">
              {simplifiedText.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-white text-lg leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
}