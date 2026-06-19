import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Fretboard from './pages/Fretboard';
import './index.css';

// Placeholder components
import Harmony from './pages/Harmony';
import Pulse from './pages/Pulse';

import Landing from './pages/Landing';
import Ladder from './pages/Ladder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Fretboard />} />
        <Route path="/harmony" element={<Harmony />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/ladder" element={<Ladder />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
