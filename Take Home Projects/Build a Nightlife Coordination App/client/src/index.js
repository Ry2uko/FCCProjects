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
        <Route exact path="/login" element={<App component="Form-Login" />} />
        <Route exact path="/register" element={<App component="Form-Register" />} />
        <Route path="*" element={<App component="Home" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);