import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import ListPage from './components/ListPage.jsx';
import AllLists from './components/AllLists.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list/:id" element={<ListPage />} />
        <Route path="/all-lists" element={<AllLists />} />
      </Routes>
    </Router>
  );
}

export default App;