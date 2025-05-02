import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Books from './pages/Books/Books';
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import Members from './pages/Members/Members';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/books">Books</Link> | <Link to="/members">Members</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Welcome to the Book Library</h1>} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </div>
  </Router>
  );
}

export default App;
