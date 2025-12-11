import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TerminalPage from './pages/TerminalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/terminal" element={<TerminalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;