import './Profile.sass';
import { sampleData, ReqTradeContainer } from '../ReqTrade/ReqTrade';
import React from 'react';
import $ from 'jquery';
import { useParams, useNavigate } from 'react-router-dom';

async function getUser(userId) {
  const response = await fetch(`/users?id=${userId}`);
  const userObj = await response.json();
  return userObj.user;
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };

    this.handleUserBooksBtn = this.handleUserBooksBtn.bind(this);
  }

  handleUserBooksBtn() {
    let route;

    if (this.props.type === 'profile') route = '/profile';

    this.props.navigate('/profile/books', { state: { recent: route } });
  }

  componentDidMount() {
    getUser(this.props.user.id).then(user => {
      this.setState({ user });
      console.log('state: ', this.state.user);
    });

    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.user == null) {
      return (
        <span className="loading-container">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </span>
      );
    } else {
      return (
        <div className="Profile">
          <div className="user-container">
            <div className="user-avatar-container">
              <img src={this.state.user.avatar_url} alt="user-avatar" id="userAvatar" />
            </div>
            <div className="user-info-container">
              <div className="info-main-container">
                <h4 className="user-name-container">
                  <span id="userName">
                    {this.state.user.username}
                  </span>
                  <span className="location-container">
                    <span className="location-icon"><i className="fa-solid fa-location-dot"></i></span>
                    <span id="userLocation">{this.state.user.location}</span>
                  </span>
                </h4>
                <p id="userDescription">{this.state.user.bio}</p>
              </div>
              <div className="user-btn-container">
                <button type="button" id="userBooksBtn" onClick={this.handleUserBooksBtn}><i className="fa-solid fa-book"></i>{this.state.user.username}'s Books</button>
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
}

export default function WithRouter(props) {
  let { userId } = useParams();
  const navigate = useNavigate();
  return (
    <Profile type={props.type} user={props.user} navigate={navigate} />
  );
}
