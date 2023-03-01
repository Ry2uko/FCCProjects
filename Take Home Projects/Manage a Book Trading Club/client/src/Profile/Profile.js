import './Profile.sass';
import { sampleData, ReqTradeContainer } from '../ReqTrade/ReqTrade';
import React from 'react';
import $ from 'jquery';

class Profile extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
  }
  render() {
    return (
      <div className="Profile">
        <div className="user-container">
          <div className="user-avatar-container">
            <img src="https://avatars.githubusercontent.com/u/83095832?v=4" alt="user-avatar" id="userAvatar" />
          </div>
          <div className="user-info-container">
            <div className="info-main-container">
              <h4 id="userName">Ry2uko</h4>
              <p id="userDescription">Just a dev for fun.</p>
            </div>
            <div className="location-container">
              <span className="location-icon"><i className="fa-solid fa-location-dot"></i></span>
              <span id="userLocation">Philippines</span>
            </div>
            <div className="user-btn-container">
              <button type="button" id="userBooksBtn"><i className="fa-solid fa-book"></i>Ry2uko's Books</button>
            </div>
          </div>
          <div className="profile-btn-container">
            <button type="button" id="requestsBtn" className="profile-btn" title="Requests">
              <i className="fa-solid fa-share"></i>
            </button>
            <button type="button" id="settingsBtn" className="profile-btn" title="Settings">
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
        </div>
        <div className="recent-trade-container">
          <h2 className="recent-trade-title">Recent Trade</h2>
          <div className="recTrade-container">
            <ReqTradeContainer 
              type="trade-profile"
              userAName={sampleData.userAName}
              userABooks={sampleData.userABooks}
              userBName={sampleData.userBName}
              userBBooks={sampleData.userBBooks}
            />
          </div>
          <button type="button" id="userTradesBtn" className="user-btn" title="Trade History">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default function WithRouter(props) {
  return (
    <Profile type={props.type} />
  );
}
