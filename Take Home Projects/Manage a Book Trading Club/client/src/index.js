import './index.sass';
import Book from './Book/Book.js';
import Form from './Form/Form.js';
import ReqTrade from './ReqTrade/ReqTrade.js';
import User from './User/User.js';
import Profile from './Profile/Profile.js';
import UserBooks from './UserBooks/UserBooks.js';
import UserTrades from './UserTrades/UserTrades.js';

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

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/books" replace />;
  return children;
};

function toggleUserDropdown() {
  $('.user-dropdown-content').css('display', $('.user-dropdown-content').css('display') === 'none' ? 'flex': 'none');
}

const CreateModal = () => {
  return (
    <div className="CreateModal">
      <div className="create-option-container">
        <h6 className="option-title">New Book</h6>
        <span className="option-description">Create a book for trade</span>
      </div>
      <div className="create-option-container">
        <h6 className="option-title">New Request</h6>
        <span className="option-description">Create a request for a trade</span>
      </div>  
    </div>
  );
};

const Navigation = ({ navFloatRight }) => {
  return (
    <div className="Navigation parent-container">
      <nav className="app-nav">
        <div className="nav-wrapper">
          <div className="navbar-header">
            <Link to="/books" className="navbar-brand">BTc</Link>
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
            { navFloatRight }
          </ul>
        </div>
      </nav>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(undefined);
  const [navFloatRight, setNavFloatRight] = useState(null);

  const handleCreateBtn = () => {
    const MS = 250;

    $('.user-dropdown-content').css('display', 'none');

    $('.CreateModal').css({
      'display': 'flex',
      'opacity': 0
    }).animate({
      'opacity': 1
    }, MS);
    $('.parent-container').css('pointerEvents', 'none').animate({ 'opacity': 0.5 }, MS);

    $(document).on('click', function(e) {
      if ($(e.target)[0] === $('div#root')[0]) {
        $('.CreateModal').animate({
          'opacity': 0
        }, MS, function(){
          $(this).css('display', 'none');
        });
        $('.parent-container').animate({ 
          'opacity': 1 
        }, MS, function(){
          $(this).css('pointerEvents', 'auto')
        });
        $(document).off('click');
      }
    });
  }

  useEffect(() => {
    // get user from /user
    getData('/auth').then(data => {
      if (data.error) {
        setNavFloatRight(<li className="nav-item float-right"><Link to="/login" className="nav-link">Login</Link></li>);
        setUser(null);
        return;
      }
      
      getData(`/users?id=${data.user.id}`).then(userData => {
        setUser(userData.user);

        setNavFloatRight(
          <>
            <li className="nav-item float-right">
              <div className="user-dropdown" userid={ userData.user.id }>
                <button type="button" className="user-btn" onClick={toggleUserDropdown}>
                  { userData.user.username }<i className="fa-solid fa-caret-down"></i>
                  </button>
                <div className="user-dropdown-content">
                  <Link to="/profile" className="dropdown-content-btn">Profile</Link>
                  <Link to="/profile/books" className="dropdown-content-btn">My Books</Link>
                  <Link to="/profile/requests" className="dropdown-content-btn">My Requests</Link>
                  <Link to="/profile/trades" className="dropdown-content-btn">My Trades</Link>
                </div>
              </div>
            </li>
            <li className="nav-item btn-nav-item">
              <button type="button" id="createBtn" onClick={handleCreateBtn}><i className="fa-solid fa-plus"></i></button>
            </li>
          </>
        );
      });

      $('.dropdown-content-btn').on('click', () => {
        $('.user-dropdown-content').css('display', 'none');
      });
    })
  }, []);

  if (user === undefined) {
    return (
      <Router>
        <Navigation navFloatRight={navFloatRight} />
        <span className="loading-container">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </span>
      </Router>
    );
  } else {
    return (
      <Router>
        <Navigation navFloatRight={navFloatRight} />
        <CreateModal />
        <Routes>
          <Route index exact path="/books" element={<Book user={user} route="/books"/>} />
          <Route index exact path="/book/:bookId" element={<Book user={user} route="/book"/>} />
          <Route exact path="/login" element={<Form type="login" />} />
          <Route exact path="/register" element={<Form type="register" />} />
          <Route exact path="/requests" element={<ReqTrade type="request" user={user} route="/requests" />} />
          <Route exact path="/request/:requestId" element={<ReqTrade user={user} type="request" route="/request" />} />
          <Route exact path="/trades" element={<ReqTrade type="trade" user={user} route="/trades" />} />
          <Route exact path="/trade/:tradeId" element={<ReqTrade user={user} type="trade" route="/trade" />} />
          <Route exact path="/users" element={<User user={user} />} />
          <Route exact path="/user/:username" element={<Profile type="user" user={user} />} />
          <Route exact path="/user/:username/books" element={<UserBooks type="user" user={user} />} />
          <Route exact path="/user/:username/trades" element={<UserTrades type="user" user={user} />} />
          { /* Protected Routes */ }        
          <Route exact path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile type="profile" user={user} />
            </ProtectedRoute>
          } />
          <Route exact path="/profile/books" element={
            <ProtectedRoute user={user}>
              <UserBooks type="profile" user={user} />
            </ProtectedRoute>
          } />
          <Route exact path="/profile/trades" element={
            <ProtectedRoute user={user}>
              <UserTrades type="profile" user={user} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </Router>
    );
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
