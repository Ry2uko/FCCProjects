import './Form.sass';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import $ from 'jquery';

function Login(props) {
  return (
    <div className="login-form form-type-container">
      <h2 className="form-title">Login</h2>
      <div className="form-container">
        <form method="POST" action="/login" id="formLogin">
          <div className="input-control">
            <label htmlFor="usernameInput">Username</label>
            <input type="text" id="usernameInput" name="username" autoComplete="off" />
          </div>
          <div className="input-control">
            <label htmlFor="passwordInput">Password</label>
            <input type="password" id="passwordInput" name="password" autoComplete="off" />
          </div>
          <label htmlFor="showPassword" className="show-password-label">
            <input type="checkbox" id="showPassword" className="show-password-input" onChange={() => props.showPassword('/login')} /> Show password
          </label>
          <button type="submit" id="loginBtn">Login</button>
        </form>
      </div>
      <div className="misc-container">
        Don't have an account? <Link to="/register" className="anchor-link">Create an account</Link>.
      </div>
    </div>
  );
}

function Register(props) {
  return (
    <div className="register-form form-type-container">
      <h2 className="form-title">Register</h2>
      <div className="form-container">
        <form method="POST" action="/register" id="formRegister">
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
            <input type="checkbox" id="showPassword" className="show-password-input" onChange={() => props.showPassword('/register')} /> Show password
          </label>
          <button type="submit" id="registerBtn">Register</button>
        </form>
      </div>
      <div className="misc-container">
        Already have an account? <Link to="/login" className="anchor-link">Log in</Link>.
      </div>
    </div>
  );
}

export default function Form(props) {
  useEffect(() => {
    $('#showPassword').prop('checked', false);
  });

  const showPassword = loginType => {
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

  let component;

  if (props.type === 'login') {
    component = <Login showPassword={showPassword} />;
  } else if (props.type === 'register') {
    component = <Register showPassword={showPassword} />;
  }

  return (
    <div className="Form">
      <h1 className="title testtest"><Link to="/">NIGHTSURFER</Link></h1>
      { component }
    </div>
  );
}