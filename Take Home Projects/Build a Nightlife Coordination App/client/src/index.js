import './index.sass';
import App from './App/App.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
    <Routes>
      <Route path="/" element={<App component="Home" />} />
      <Route path="/login" element={<App component="Form-Login" />} />
      <Route path="/register" element={<App component="Form-Register" />} />
    </Routes>
  </Router>
  </React.StrictMode>
);