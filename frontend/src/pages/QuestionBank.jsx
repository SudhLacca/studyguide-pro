import { useState } from 'react';
import { FileQuestion, ChevronDown, ChevronUp, Loader2, Download, Printer } from 'lucide-react';
import { useStudyContext } from '../context/StudyContext';
import api from '../api';

export default function QuestionBank() {
  const { globalDocumentName: documentName, setGlobalDocumentName: setDocumentName } = useStudyContext();
  const [topic, setTopic] = useState('');
  const [qBank, setQBank] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Keep track of which model answers are toggled open
  const [openAnswers, setOpenAnswers] = useState({});

  const handleGenerate = async () => {
    if (!documentName) {
      setError('Please enter a document name.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/generate-question-bank', { 
        document_name: documentName,
        topic: topic || null
      });
      
      const data = response.data.question_bank;
      if (data && data.length > 0 && data[0].error) {
        setError(data[0].error);
      } else {
        setQBank(data);
      }
    } catch (err) {
      setError('Failed to generate question bank.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (sectionIdx, questionIdx) => {
    const key = `${sectionIdx}-${questionIdx}`;
    setOpenAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadDocx = async () => {
    // Convert JSON to Markdown so our backend DOCX exporter can read it
    let markdownNotes = `# Question Bank: ${documentName}\n\n`;
    qBank.forEach(section => {
      markdownNotes += `## ${section.section_name}\n\n`;
      section.questions.forEach((q, idx) => {
        markdownNotes += `**Q${idx + 1}: ${q.question}**\n\n`;
        markdownNotes += `*Model Answer:* ${q.model_answer}\n\n`;
      });
    });

    try {
      const response = await api.post('/export-docx', 
        { notes_content: markdownNotes },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Question_Bank.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download DOCX.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:hidden">
        <div className="flex items-center gap-3 mb-2">
          <FileQuestion className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Question Bank & Model Answers</h1>
        </div>
        <p className="text-slate-400">Generate section-wise exam questions with graded model answers.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Document Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Specific Focus (Optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Chapter 3, or 'Algorithms'"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileQuestion className="w-5 h-5" />}
            {isLoading ? 'Generating Bank...' : 'Generate Question Bank'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results Display */}
      {qBank && (
        <div className="space-y-6">
          <div className="flex justify-end gap-3 print:hidden">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              <Printer className="w-4 h-4" /> Save PDF
            </button>
            <button onClick={handleDownloadDocx} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" /> Export DOCX
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg print:p-0 print:shadow-none print:bg-transparent min-h-[500px]">
            {qBank.map((section, sIdx) => (
              <div key={sIdx} className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">
                  {section.section_name}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((q, qIdx) => {
                    const isOpen = openAnswers[`${sIdx}-${qIdx}`];
                    return (
                      <div key={qIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-5 print:border-none print:bg-transparent print:p-2 print:mb-4">
                        <div className="flex gap-4">
                          <span className="font-bold text-indigo-600 text-lg">Q{qIdx + 1}.</span>
                          <div className="flex-1">
                            <p className="text-slate-800 font-medium text-lg">{q.question}</p>
                            
                            {/* Toggle Button (Hidden in print mode) */}
                            <button 
                              onClick={() => toggleAnswer(sIdx, qIdx)}
                              className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 print:hidden"
                            >
                              {isOpen ? <><ChevronUp className="w-4 h-4"/> Hide Model Answer</> : <><ChevronDown className="w-4 h-4"/> View Model Answer</>}
                            </button>

                            {/* Model Answer (Always visible in print mode) */}
                            <div className={`${isOpen ? 'block' : 'hidden'} print:block mt-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg`}>
                              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 block">Model Answer / Grading Key</span>
                              <p className="text-slate-700">{q.model_answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}