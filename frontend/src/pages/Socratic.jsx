import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Bot, AlertCircle, Loader2, Book } from 'lucide-react';
import api from '../api';

export default function Socratic() {
  const [documentName, setDocumentName] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  
  // Chat history state
  const [messages, setMessages] = useState([
    { 
      role: 'tutor', 
      content: "Hello! I am your Socratic AI Tutor. Tell me which document we are studying in the box above, and ask me a question. I won't just give you the answer—I will guide you to figure it out yourself!" 
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Ref to auto-scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!documentName.trim()) {
      setError('Please set the Target Document Name first.');
      return;
    }
    
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    
    // 1. Add user's message to the chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setCurrentInput('');
    setIsLoading(true);
    setError('');

    try {
      // 2. Send to FastAPI
      const response = await api.post('/socratic-chat', {
        question: userMessage,
        document_name: documentName
      });

      // 3. Add AI's response to the chat
      setMessages(prev => [...prev, { role: 'tutor', content: response.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the tutor.');
      // Remove the user message if it failed so they can try again
      setMessages(prev => prev.slice(0, -1));
      setCurrentInput(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-5 mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-amber-400" />
          Socratic AI Tutor
        </h1>
        <p className="mt-2 text-slate-400">
          Learn through guided questioning, not just memorization.
        </p>
      </div>

      {/* Document Target Setter */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-sm mb-6 flex-shrink-0 flex items-center gap-4">
        <Book className="w-5 h-5 text-slate-400" />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Target Document (e.g., physics_notes.pdf)"
            className="w-full bg-transparent text-white focus:outline-none placeholder-slate-500 font-medium"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
        </div>
        {!documentName && (
          <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
            Required
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm flex-shrink-0">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 bg-slate-800 rounded-t-xl border-x border-t border-slate-700 p-6 overflow-y-auto custom-scrollbar shadow-inner">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center shadow-md ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700 border border-slate-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-amber-400" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-700 text-slate-200 border border-slate-600 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 flex-row">
              <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center shadow-md bg-slate-700 border border-slate-600">
                <Bot className="w-6 h-6 text-amber-400" />
              </div>
              <div className="bg-slate-700 border border-slate-600 text-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span className="text-sm">Thinking of a good hint...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 rounded-b-xl border border-slate-700 p-4 shadow-sm flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder={documentName ? "Ask your question..." : "Set a document name above first!"}
            disabled={!documentName || isLoading}
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!documentName || !currentInput.trim() || isLoading}
            className="flex items-center justify-center w-12 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}