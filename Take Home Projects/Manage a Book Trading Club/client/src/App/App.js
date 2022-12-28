import './App.sass';
import Book from '../Book/Book.js';
import Form from '../Form/Form.js';
import MyBooks from '../MyBooks/MyBooks.js';
import NewRequest from '../NewRequest/NewRequest.js';
import ReqTrade from '../ReqTrade/ReqTrade.js';
import User from '../User/User.js';
import { Link } from 'react-router-dom';

export default function App(props) {
  let componentRender;

  switch(props.component) {
    case 'Book':
      // Also the home page
      componentRender = <Book />;
      break;
    case 'Form-Login':
      componentRender = <Form type="login" />;
      break;
    case 'Form-Register':
      componentRender = <Form type="register" />;
      break;
    case 'ReqTrade-Request':
      componentRender = <ReqTrade type="request" />;
      break;
    case 'ReqTrade-Trade':
      componentRender = <ReqTrade type="trade" />;
      break;
    case 'NewRequest':
      componentRender = <NewRequest />;
      break;
    case 'MyBooks':
      componentRender = <MyBooks />;
      break;
    case 'User':
      componentRender = <User />;
      break;

    default:
      break;
  }

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
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      {componentRender}
    </div>
  );
}