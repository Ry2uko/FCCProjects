import './index.sass'
import App from './App/App.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Routes for /login and /register, and also for other 404 which will route to Home
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/login" element={<App component="Form-Login" />} />
        <Route exact path="/register" element={<App component="Form-Register" />} />
        <Route exact path="/books" element={<App component="Book" />} />
        <Route exact path="/requests" element={<App component="ReqTrade-Request" />} />
        <Route exact path="/trades" element={<App component="ReqTrade-Trade" />} />
        <Route exact path="/requests/new" element={<App component="NewRequest" />} />
        <Route exact path="/books/my" element={<App component="MyBooks" />} />
        <Route exact path="/users" element={<App component="User" />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);