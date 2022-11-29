import './App.sass';
import Book from '../Book/Book.js';
import Form from '../Form/Form.js';
import MyBooks from '../MyBooks/MyBooks.js';
import NewRequest from '../NewRequest/NewRequest.js';
import ReqTrade from '../ReqTrade/ReqTrade.js';
import User from '../User/User.js';

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
      {componentRender}
    </div>
  );
}