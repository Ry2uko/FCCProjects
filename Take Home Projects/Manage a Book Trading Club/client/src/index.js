// will be index.js

import './index.sass';
import Book from './Book/Book.js';
import Form from './Form/Form.js';
import ReqTrade from './ReqTrade/ReqTrade.js';
import User from './User/User.js';
import Profile from './Profile/Profile.js';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import $ from 'jquery';

async function getUser() {
  const response = await fetch('/auth');
  const userObj = await response.json();
  return userObj;
}

const ProtectedRoute = ({ user, children }) => {
  if (user == null) return <Navigate to="/books" replace />;
  return children;
};

function toggleUserDropdown() {
  $('.user-dropdown-content').css('display', $('.user-dropdown-content').css('display') === 'none' ? 'flex': 'none');
}

const Navigation = ({ navFloatRight }) => {
  return (
    <div className="Navigation">
      <nav className="app-nav">
        <div className="nav-wrapper">
          <div className="navbar-header">
            <Link to="/books" className="navbar-brand">Book Trading Club</Link>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/books" className="nav-link">Books</Link>
            </li>
            <li className="nav-item">
              <Link to="/requests" className="nav-link">Requests</Link>
            </li>
            <li className="nav-item">
              <Link to="/trades" className="nav-link">Trades</Link>
            </li> 
            <li className="nav-item">
              <Link to="/users" className="nav-link">Users</Link>
            </li> 
            <li className="nav-item float-right">
              { navFloatRight }
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [navFloatRight, setNavFloatRight] = useState(null);

  useEffect(() => {
    // get user from auth
    getUser().then(data => {
      console.log('called');
      if (data.error) {
        setNavFloatRight(<Link to="/login" className="nav-link">Login</Link>);
        return;
      }
      
      setUser(data.user);

      setNavFloatRight(
        <div className="user-dropdown" userid={ data.user.id }>
          <button type="button" className="user-btn" onClick={toggleUserDropdown}>
            { data.user.username }<i className="fa-solid fa-caret-down"></i>
            </button>
          <div className="user-dropdown-content">
            <Link to="/profile" className="dropdown-content-btn">Profile</Link>
            <Link to="/profile/books" className="dropdown-content-btn">My Books</Link>
            <Link to="/profile/requests" className="dropdown-content-btn">My Requests</Link>
          </div>
        </div>
      );

      $('.dropdown-content-btn').on('click', () => {
        $('.user-dropdown-content').css('display', 'none');
      });
    });
  }, []);

  return (
    <Router>
      <Navigation navFloatRight={navFloatRight} />
      <Routes>
        <Route index exact path="/books" element={<Book />} />
        <Route exact path="/login" element={<Form type="login" />} />
        <Route exact path="/register" element={<Form type="register" />} />
        <Route exact path="/requests" element={<ReqTrade type="request" />} />
        <Route exact path="/trades" element={<ReqTrade type="trade" />} />
        <Route exact path="/users" element={<User />} />
        { /* Protected Routes */ }        
        <Route exact path="/profile" element={
          <ProtectedRoute user={user}>
            <Profile type="main" />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </Router>
  );
};

const WithRouter = () => {

}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
