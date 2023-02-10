import './App.sass';
import Book from '../Book/Book.js';
import Form from '../Form/Form.js';
import MyBooks from '../MyBooks/MyBooks.js';
import NewRequest from '../NewRequest/NewRequest.js';
import ReqTrade from '../ReqTrade/ReqTrade.js';
import User from '../User/User.js';
import Profile from '../Profile/Profile.js';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

async function getUser() {
  const response = await fetch('/auth');
  const userObj = await response.json();
  return userObj;
}

export default function App(props) {
  let componentRender = useRef();
  // Replace when authorized
  const [floatRightAuth, setFloatRightAuth] = useState(<Link to="/login" className="nav-link">Login</Link>);

  switch(props.component) {
    case 'Book':
      // Also the home page
      componentRender.current = <Book />;
      break;
    case 'Form-Login':
      componentRender.current = <Form type="login" />;
      break;
    case 'Form-Register':
      componentRender.current = <Form type="register" />;
      break;
    case 'ReqTrade-Request':
      componentRender.current = <ReqTrade type="request" />;
      break;
    case 'ReqTrade-Trade':
      componentRender.current = <ReqTrade type="trade" />;
      break;
    case 'NewRequest':
      componentRender.current = <NewRequest />;
      break;
    case 'MyBooks':
      componentRender.current = <MyBooks />;
      break;
    case 'User':
      componentRender.current = <User />;
      break;
    case 'Profile-Main':
      componentRender.current = <Profile />;
      break;

    default:
      break;
  }

  function openUserDropdown() {
    $('.user-dropdown-content').css('display', $('.user-dropdown-content').css('display') === 'none' ? 'flex': 'none');
  }

  useEffect(() => {
    getUser().then(data => {
      if (data.error) return;
      console.log(data);
      setFloatRightAuth(
        <div className="user-dropdown" userid={ data.user.id }>
          <button type="button" className="user-btn" onClick={openUserDropdown}>
            { data.user.username }<i className="fa-solid fa-caret-down"></i>
            </button>
          <div className="user-dropdown-content">
            <Link to="/profile" className="dropdown-content-btn">Profile</Link>
            <Link to="/profile/books" className="dropdown-content-btn">My Books</Link>
            <Link to="/profile/requests" className="dropdown-content-btn">My Requests</Link>
          </div>
        </div>
      );
    });
  }, []);

  return (
    <div className="App">
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
              { floatRightAuth }
            </li>
          </ul>
        </div>
      </nav>
      { componentRender.current }
    </div>
  );
}