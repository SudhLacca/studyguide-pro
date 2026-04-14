import { useState } from 'react';
import { GraduationCap, Sparkles, AlertCircle, Loader2, FileCheck2, Printer } from 'lucide-react';
import api from '../api';

export default function MockExam() {
  const [documentName, setDocumentName] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [examData, setExamData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateExam = async (e) => {
    e.preventDefault();
    if (!documentName) {
      setError('Please enter the name of the document.');
      return;
    }

    setIsLoading(true);
    setError('');
    setExamData('');

    try {
      const response = await api.post('/generate-exam', {
        document_name: documentName,
        num_questions: parseInt(numQuestions, 10)
      });
      
      // The backend returns {"exam": exam_data}
      setExamData(response.data.exam);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate mock exam.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-purple-400" />
          Mock Exam Center
        </h1>
        <p className="mt-2 text-slate-400">
          Test your knowledge with AI-generated practice questions based on your notes.
        </p>
      </div>

      {/* Control Panel (Hidden during print) */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm print:hidden">
        <form onSubmit={handleGenerateExam} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., biology_chapter_4.pdf"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-300 mb-1">Number of Questions</label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !documentName}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 h-[42px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Drafting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Exam
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

      {/* Generated Exam Paper */}
      {examData && (
        <div className="bg-slate-100 rounded-xl p-8 shadow-xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 print:bg-white print:p-0 print:shadow-none">
          
          {/* Exam Header */}
          <div className="border-b-2 border-slate-300 pb-6 mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-purple-600" />
                Practice Examination
              </h2>
              <p className="text-slate-600 mt-1">Source Material: <span className="font-semibold">{documentName}</span></p>
            </div>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print Exam
            </button>
          </div>

          {/* Exam Content */}
          <div className="prose max-w-none">
            {typeof examData === 'string' ? (
              examData.split('\n').map((line, idx) => {
                // Simple formatting to make questions bold
                if (line.match(/^\d+\./) || line.toLowerCase().startsWith('q:')) {
                  return <p key={idx} className="font-bold text-lg mt-6 mb-2">{line}</p>;
                }
                return <p key={idx} className="mb-2 pl-4">{line}</p>;
              })
            ) : (
              <pre className="whitespace-pre-wrap">{JSON.stringify(examData, null, 2)}</pre>
            )}
          </div>
          
          {/* Exam Footer */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-center text-sm text-slate-500 italic">
            End of Examination. Generated by StudyGuide Pro AI.
          </div>
        </div>
      )}

    </div>
  );
}