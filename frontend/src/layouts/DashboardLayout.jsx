import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, FileText, Layers, BookOpen, Wand2, LogOut, FileEdit, FileQuestion 
} from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Detailed Notes', href: '/dashboard/notes', icon: FileEdit }, 
    { name: 'Summary', href: '/dashboard/summary', icon: FileText },
    { name: 'Flashcards', href: '/dashboard/flashcards', icon: Layers },
    { name: 'Study Guide', href: '/dashboard/study-guide', icon: BookOpen },
    { name: 'Question Bank', href: '/dashboard/question-bank', icon: FileQuestion },
    { name: 'Simplifier', href: '/dashboard/simplify', icon: Wand2 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans print:h-auto print:bg-white print:overflow-visible">
      
      {/* 1. The Persistent Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between print:hidden">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white tracking-wide">📚 StudyGuide Pro</h1>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 2. The Main Stage */}
      <div className="flex-1 flex flex-col relative overflow-hidden print:overflow-visible">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between px-8 print:hidden">
          <h2 className="text-lg font-semibold text-white">
            {navigation.find(n => n.href === location.pathname)?.name || 'Study Workspace'}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Explicit Logout Button replacing the ME avatar */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
        </header>

        {/* Dynamic Page Content Injector */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar print:p-0 print:overflow-visible">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}