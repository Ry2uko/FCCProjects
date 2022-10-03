import './Form.sass';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

function Login(props) {

  const handleFormSubmit = e => {
    e.preventDefault();
  }

  const handleLogIn = () => {
    let username = $('#usernameInput').val(),
    password = $('#passwordInput').val();

    if (username.trim() === '' || password.trim() === '') return;

    $.ajax({
      method: 'POST',
      url: '/login',
      data: {
        username, password
      },
      success: () => {
        props.navigate('/', { replace: true });
      },
      error: resp => {
        $('.error-container').text(resp.responseJSON.error).css('display', 'block');
      }
    });
  }

  return (
    <div className="login-form form-type-container">
      <h2 className="form-title">Login</h2>
      <div className="error-container"></div>
      <div className="form-container">
        <form method="POST" action="/" id="formLogin" onSubmit={handleFormSubmit}>
          <div className="input-control">
            <label htmlFor="usernameInput">Username</label>
            <input type="text" id="usernameInput" name="username" autoComplete="off" />
          </div>
          <div className="input-control">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" id="passwordInput" name="password" autoComplete="off" />
          </div>
          <label htmlFor="showPassword" className="show-password-label">
            <input type="checkbox" id="showPassword" className="show-password-input" onChange={() => props.showPassword('login')} /> Show password
          </label>
          <button type="submit" id="loginBtn" onClick={handleLogIn}>Login</button>
        </form>
      </div>
      <div className="misc-container">
        Don't have an account? <Link to="/register" className="anchor-link">Create an account</Link>.
      </div>
    </div>
  );
}

function Register(props) {

  const handleFormSubmit = e => {
    e.preventDefault();
  }

  const handleRegister = () => {

    let username = $('#usernameInput').val(),
    password = $('#passwordInput').val(),
    confirmPassword = $('#confirmPasswordInput').val();

    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') return;

    $.ajax({
      method: 'POST',
      url: '/register',
      data: {
        username, password, confirmPassword
      },
      success: () => {
        props.navigate('/', { replace: true });
      },
      error: resp => {
        $('.error-container').text(resp.responseJSON.error).css('display', 'block');
      }
    });
  };

  return (
    <div className="register-form form-type-container">
      <h2 className="form-title">Register</h2>
      <div className="error-container"></div>
      <div className="form-container">
        <form method="POST" action="/" id="formRegister" onSubmit={handleFormSubmit}>
          <div className="input-control">
            <label htmlFor="usernameInput">Username</label>
            <input type="text" id="usernameInput" name="username" autoComplete="off" />
          </div>
          <div className="input-control">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" id="passwordInput" name="password" />
          </div>
          <div className="input-control">
            <label htmlFor="confirmPasswordInput">Confirm Password</label>
            <input type="password" id="confirmPasswordInput" name="confirm-password" />
          </div>
          <label htmlFor="showPassword" className="show-password-label">
            <input type="checkbox" id="showPassword" className="show-password-input" onChange={() => props.showPassword('register')} /> Show password
          </label>
          <button type="submit" id="registerBtn" onClick={handleRegister}>Register</button>
        </form>
      </div>
      <div className="misc-container">
        Already have an account? <Link to="/login" className="anchor-link">Log in</Link>.
      </div>
    </div>
  );
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(loginType) {
    if (loginType === 'register') {
      if ($('#showPassword').is(':checked')) {
        $('#passwordInput').attr('type', 'text');
        $('#confirmPasswordInput').attr('type', 'text');
      } else {
        $('#passwordInput').attr('type', 'password');
        $('#confirmPasswordInput').attr('type', 'password');
      }
    } else {
      $('#showPassword').is(':checked')
      ? $('#passwordInput').attr('type', 'text')
      : $('#passwordInput').attr('type', 'password');
    }
  }

  componentDidMount() {
    $('#showPassword').prop('checked', false);
    
    $.ajax({
      method: 'GET',
      url: '/auth',
      success: () => { 
        this.props.navigate('/', { replace: true });
      }
    });
  }

  render() {
    let component;

    if (this.props.type === 'login') {
      component = <Login showPassword={this.showPassword} navigate={this.props.navigate}/>;
    } else if (this.props.type === 'register') {
      component = <Register showPassword={this.showPassword} navigate={this.props.navigate}/>;
    }

    return (
      <div className="Form">
        <h1 className="title testtest"><Link to="/">NIGHTSURFER</Link></h1>
        { component }
      </div>
    );
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();

  return (
    <Form navigate={navigate} type={props.type}/>
  );
}