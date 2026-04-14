import { useState, useEffect } from 'react';
import { Book, BrainCircuit, GraduationCap, Flame } from 'lucide-react';
import DocumentUploader from '../components/DocumentUploader';
import api from '../api';
// 1. ADDED: Import the global memory context
import { useStudyContext } from '../context/StudyContext'; 

export default function Dashboard() {
  const [activeDocument, setActiveDocument] = useState(null);
  
  // 2. ADDED: Pull in the setGlobalDocumentName function from the context
  const { setGlobalDocumentName } = useStudyContext(); 
  
  // State to hold our dynamic database statistics
  const [stats, setStats] = useState({
    documents_analyzed: 0,
    flashcards_generated: 0,
    study_guides_created: 0,
    current_streak: 0 // <-- ADDED: Track the study streak
  });

  // Fetch stats from the backend as soon as the Dashboard loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/user-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch user stats', error);
      }
    };
    fetchStats();
  }, []);

  const handleUploadComplete = (filename) => {
    setActiveDocument(filename);
    
    // 3. ADDED: Save the filename to global memory so it auto-fills on other tabs!
    setGlobalDocumentName(filename); 
    
    // Instantly update the UI counter without needing to refresh the page
    setStats(prev => ({
      ...prev,
      documents_analyzed: prev.documents_analyzed + 1
    }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-2xl p-8 border border-indigo-500/20 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to your Study Workspace</h1>
          <p className="text-indigo-200">
            Upload your lecture notes, and let the AI extract flashcards, visual maps, and detailed notes for you.
          </p>
        </div>
        
        {/* NEW STREAK BADGE */}
        <div className="hidden md:flex flex-col items-center justify-center bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 min-w-[120px]">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-2xl">
            <Flame className="w-6 h-6 fill-orange-500" />
            {stats.current_streak}
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Day Streak</span>
        </div>
      </div>

      {/* Dynamic Stats Grid connected to the database */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Book className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Documents Analyzed</p>
            <p className="text-2xl font-bold text-white">{stats.documents_analyzed}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <BrainCircuit className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Flashcards Generated</p>
            <p className="text-2xl font-bold text-white">{stats.flashcards_generated}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <GraduationCap className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Study Guides Created</p>
            <p className="text-2xl font-bold text-white">{stats.study_guides_created}</p>
          </div>
        </div>
      </div>

      {/* The Uploader Component */}
      <div className="mt-8 pt-8 border-t border-slate-800">
        <DocumentUploader onUploadSuccess={handleUploadComplete} />
      </div>

      {/* Active Document Indicator */}
      {activeDocument && (
        <div className="flex justify-center mt-6">
          <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg inline-block shadow-lg">
            <span className="text-emerald-400 font-medium">
              Currently Studying: <span className="text-white ml-2">{activeDocument}</span>
            </span>
            <p className="text-sm text-slate-400 mt-2">Use the sidebar to generate study materials for this document.</p>
          </div>
        </div>
      )}

    </div>
  );
}