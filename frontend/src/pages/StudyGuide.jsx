import { useState, useEffect, useRef } from 'react';
import { BookOpen, Sparkles, AlertCircle, Loader2, Network, BookMarked } from 'lucide-react';
import mermaid from 'mermaid';
import api from '../api';

export default function StudyGuide() {
  const [documentName, setDocumentName] = useState('');
  const [guideData, setGuideData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!documentName) {
      setError('Please enter the name of the document.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGuideData(null);

    try {
      const response = await api.post('/study-guide', {
        document_name: documentName
      });
      setGuideData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate study guide.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Visual Study Guide
        </h1>
        <p className="mt-2 text-slate-400">
          Generate an interactive mind map and key glossary from your notes.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., machine_learning_basics.pdf"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !documentName}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 h-[42px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mapping...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Guide
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Results Area */}
      {guideData && (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8">
          
          {/* Section 1: The Visual Mind Map */}
          {guideData.mindmap_code && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Network className="w-5 h-5 text-blue-400" />
                Concept Mind Map
              </h2>
              <div className="w-full overflow-x-auto bg-slate-900/50 rounded-lg p-4 custom-scrollbar">
                <MermaidViewer chart={guideData.mindmap_code} />
              </div>
            </div>
          )}

          {/* Section 2: The Auto-Glossary */}
          {guideData.glossary && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <BookMarked className="w-5 h-5 text-blue-400" />
                Key Terms & Definitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(guideData.glossary).map(([term, definition], idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                    <h3 className="text-blue-400 font-bold mb-1">{term}</h3>
                    <p className="text-slate-300 text-sm">{definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      )}

    </div>
  );
}

// --- HELPER COMPONENT: Renders the Mermaid JS code into an SVG ---
function MermaidViewer({ chart }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    // Initialize Mermaid with a dark theme to match our app
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'inherit'
    });

    if (mermaidRef.current && chart) {
      // Clear old chart
      mermaidRef.current.innerHTML = '';
      
      // Render new chart
      const renderChart = async () => {
        try {
          const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), chart);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid failed to render:", error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '<p class="text-red-400 text-sm">Failed to render diagram. The AI might have generated invalid Mermaid syntax.</p>';
          }
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div ref={mermaidRef} className="flex justify-center min-h-[300px]" />;
}