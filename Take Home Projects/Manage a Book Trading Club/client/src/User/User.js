import './User.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class User extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/users"]').attr('class', 'nav-link active');
  }
  render() {
    return (
      <div className="User">
        <div className="title-banner">
          <h1 className="title">Users</h1>
        </div>
        <div className="users-container">
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <div class="user-info-main-container">
              <div class="user-title-container">
                <div class="user-image-container">
                  <img src="https://avatars.githubusercontent.com/u/83095832?v=4" className="user-avatar" alt="Avatar" />
                </div>
                <h4 className="user-name-container">
                  <span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span>
                </h4>
              </div>
              <p className="user-bio">Just a developer for fun.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <User navigate={navigate} />
  );
}