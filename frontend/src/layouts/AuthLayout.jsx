import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            📚 StudyGuide Pro
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>
        
        {/* The Outlet is where the actual Login form will be injected */}
        <Outlet />
        
      </div>
    </div>
  );
}