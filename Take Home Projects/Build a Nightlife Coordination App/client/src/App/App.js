import './App.sass';
import Home from '../Home/Home.js';
import Form from '../Form/Form.js';
import $ from 'jquery';

export default function App(props) {
  let componentRender;

  switch (props.component) {
    case 'Home':
      componentRender = <Home />;
      $('body').css('background-image', 
      `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/img/nightlife0.jpg')`);
      break;

    case 'Form-Login':
      componentRender = <Form type="login" />;
      $('body').css('background-image', 
      `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/img/nightlife1.jpg')`);
      break;

    case 'Form-Register':
      componentRender = <Form type="register" />;
      $('body').css('background-image', 
      `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/img/nightlife1.jpg')`);
      break;

    default:
      break;
  }

  return <div className="App">{componentRender}</div>;
}
