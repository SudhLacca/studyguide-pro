import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Make sure your CSS is still imported!

// 1. Import the StudyProvider you just created
import { StudyProvider } from './context/StudyContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the App component inside the StudyProvider */}
    <StudyProvider>
      <App />
    </StudyProvider>
  </React.StrictMode>
);