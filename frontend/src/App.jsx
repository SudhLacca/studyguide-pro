import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import our Layouts and Pages
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Summary from './pages/Summary'; 
import Flashcards from './pages/Flashcards'; 
import StudyGuide from './pages/StudyGuide';
import Simplify from './pages/Simplify';
import DetailedNotes from './pages/DetailedNotes';
import QuestionBank from './pages/QuestionBank';

// --- SECURITY WRAPPER ---
// This checks if the user has a valid token before letting them see the dashboard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token is found, redirect them to the login page ("/")
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. PUBLIC ROUTES (No login required) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 2. PROTECTED ROUTES (Login strictly required) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* The real Dashboard is now the default page when you click login! */}
          <Route index element={<Dashboard />} />
          
          {/* Your Fully Functional AI Feature Modules! */}
          <Route path="summary" element={<Summary />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="study-guide" element={<StudyGuide />} />
          <Route path="simplify" element={<Simplify />} />
          <Route path="notes" element={<DetailedNotes />} />
          <Route path="question-bank" element={<QuestionBank />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}