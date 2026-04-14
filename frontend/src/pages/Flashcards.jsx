import { useState } from 'react';
import { Layers, Sparkles, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import api from '../api';

export default function Flashcards() {
  // Form State
  const [documentName, setDocumentName] = useState('');
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(5);

  // App State
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Track which cards are currently flipped
  const [flippedCards, setFlippedCards] = useState({});

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!documentName) {
      setError('Please enter the name of the document.');
      return;
    }

    setIsLoading(true);
    setError('');
    setFlashcards([]);
    setFlippedCards({}); // Reset flips

    try {
      const response = await api.post('/flashcards', {
        document_name: documentName,
        topic: topic || null,
        num_cards: parseInt(numCards, 10)
      });

      setFlashcards(response.data.flashcards);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate flashcards.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-emerald-400" />
          Smart Flashcards
        </h1>
        <p className="mt-2 text-slate-400">
          Turn your notes into interactive study cards instantly.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., history_chapter_1.pdf"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Number of Cards</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={numCards}
                onChange={(e) => setNumCards(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-300 mb-1">Specific Topic (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Only generate cards about the dates and events"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !documentName}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Cards
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Flashcards Grid */}
      {flashcards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in duration-500">
          {flashcards.map((card, index) => (
            
            // 3D Flip Container
            <div 
              key={index}
              className="relative w-full h-64 cursor-pointer group"
              style={{ perspective: '1000px' }}
              onClick={() => toggleFlip(index)}
            >
              {/* The Card Body (handles the rotation) */}
              <div 
                className="w-full h-full transition-transform duration-500 rounded-xl shadow-lg relative"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                
                {/* FRONT OF CARD (Question) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-slate-800 border-2 border-slate-700 hover:border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-emerald-400 font-bold tracking-wider text-sm mb-4 uppercase">Question</span>
                  <p className="text-white text-lg font-medium">{card.question}</p>
                  <div className="mt-auto flex items-center gap-2 text-slate-500 text-sm">
                    <RotateCw className="w-4 h-4" />
                    <span>Click to flip</span>
                  </div>
                </div>

                {/* BACK OF CARD (Answer) */}
                <div 
                  className="absolute inset-0 w-full h-full bg-emerald-600 border-2 border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center text-center"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)' // This mirrors the back so text isn't backwards!
                  }}
                >
                  <span className="text-emerald-200 font-bold tracking-wider text-sm mb-4 uppercase">Answer</span>
                  <p className="text-white text-lg font-medium overflow-y-auto custom-scrollbar">{card.answer}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}