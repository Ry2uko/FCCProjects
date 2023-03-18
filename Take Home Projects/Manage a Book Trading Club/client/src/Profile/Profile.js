import './Profile.sass';
import { ReqTradeContainer } from '../ReqTrade/ReqTrade';
import React, { useEffect } from 'react';
import $ from 'jquery';
import { useParams, useNavigate } from 'react-router-dom';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null, 
      books: null,
      recentTrade: null
    };

    this.handleUserBooksBtn = this.handleUserBooksBtn.bind(this);
    this.renderReqTrade = this.renderReqTrade.bind(this);
    this.handleUserTradesBtn = this.handleUserTradesBtn.bind(this);
    this.handleOpenBookBtn = this.handleOpenBookBtn.bind(this);
    this.handleUserRequestsBtn = this.handleUserRequestsBtn.bind(this);
    this.handleOpenReqTradeBtn = this.handleOpenReqTradeBtn.bind(this);
    this.handleProfileSettingsBtn = this.handleProfileSettingsBtn.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }

  handleImageError(evnt) {
    $(evnt.target).attr('src', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');
  }

  handleOpenReqTradeBtn(reqTradeId) {
    let route = '/books';

    if (this.props.type === 'profile') route = '/profile';
    else if (this.props.type === 'user') route = `/user/${this.props.username}`;

    this.props.navigate(`/trade/${reqTradeId}`, { state: { route } });
  }

  handleOpenBookBtn(bookId) {
    let route = '/books';

    if (this.props.type === 'profile') route = '/profile';
    else if (this.props.type === 'user') route = `/user/${this.props.username}`;

    this.props.navigate(`/book/${bookId}`, { state: { route }})
  }

  handleProfileSettingsBtn() {
    this.props.navigate('/profile/settings');
  }

  handleUserBooksBtn() {
    let route = '/books';

    if (this.props.type === 'profile') route = '/profile/books';
    else if (this.props.type === 'user') route = `/user/${this.props.username}/books`;

    this.props.navigate(route);
  }

  handleUserTradesBtn() {
    let route = '/trades';

    if (this.props.type === 'profile') route = '/profile/trades';
    else if (this.props.type === 'user') route = `/user/${this.props.username}/trades`;

    this.props.navigate(route);
  }

  handleUserRequestsBtn() {
    let route = '/trades';

    if (this.props.type === 'profile') route = '/profile/requests';
    else if (this.props.type === 'user') route = `/user/${this.props.username}/requests`;

    this.props.navigate(route);
  }

  renderReqTrade() {
    const formattedUserABooks = this.state.recentTrade.userABooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() === bookId);
      a.push(book);
      return a;
    }, []);

    const formattedUserBBooks = this.state.recentTrade.userBBooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() === bookId);
      a.push(book);
      return a;
    }, []);


    return <ReqTradeContainer 
      type="trade-profile"
      userA={this.state.recentTrade.userA}
      userABooks={formattedUserABooks}
      userB={this.state.recentTrade.userB}
      userBBooks={formattedUserBBooks}
      user={this.state.user}
      reqTradeId={this.state.recentTrade._id.toString()}
      handleOpenBookBtn={this.handleOpenBookBtn}
      handleOpenReqTradeBtn={this.handleOpenReqTradeBtn}
    />;
    
  }

  componentDidMount() {
    let route = '';
    
    if (this.props.type === 'profile') route = `/users?id=${this.props.user.id}`;
    else if (this.props.type === 'user') route = `/users?username=${this.props.username}`;

    getData(route).then(({ user }) => {
      if (user.trades.length < 1) {
        this.setState({ user });
      } else {
        let recentTradeId = user.trades[0];

        getData(`/trades?id=${recentTradeId}`).then(({ trade }) => {
          this.setState({ user, recentTrade: trade });
        });
      }
    });

    getData('/books').then(({ books }) => {
      this.setState({ books });
    })

    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.user == null || this.state.books == null) {
      return (
        <div className="parent-container">
          <span className="loading-container">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </span>
        </div>
      );
    } else {
      return (
        <div className="Profile parent-container">
          <div className="user-container">
            <div className="user-avatar-container">
              <img src={this.state.user.avatar_url} alt="user-avatar" id="userAvatar" onError={(e) => this.handleImageError(e)} />
            </div>
            <div className="user-info-container">
              <div className="info-main-container">
                <h4 className="user-name-container">
                  <span id="userName">
                    {this.state.user.username}
                  </span>
                  { (!this.state.user.hide_location && this.state.user.location) ? (
                    <span className="location-container">
                      <span className="location-icon"><i className="fa-solid fa-location-dot"></i></span>
                      <span id="userLocation">{this.state.user.location}</span>
                    </span>
                  ) : null}
                </h4>
                <p id="userDescription">{this.state.user.bio}</p>
              </div>
              <div className="user-btn-container">
                <button type="button" id="userBooksBtn" onClick={this.handleUserBooksBtn}><i className="fa-solid fa-book"></i>{this.state.user.username}'s Books</button>
              </div>
            </div>
            <div className="profile-btn-container">
              <button type="button" id="requestsBtn" className="profile-btn" title="Requests" onClick={this.handleUserRequestsBtn}>
                <i className="fa-solid fa-share"></i>
              </button>
              {
                this.props.type === 'profile' ? (
                  <button type="button" id="settingsBtn" className="profile-btn" title="Settings" onClick={this.handleProfileSettingsBtn}>
                    <i className="fa-solid fa-gear"></i>
                  </button>
                ) : null
              }
            </div>
          </div>
          <div className="recent-trade-container">
            <h2 className="recent-trade-title">Recent Trade</h2>
            <div className="recTrade-container">
              { this.state.recentTrade ? this.renderReqTrade() : (
                <span className="no-trades-text">No trades yet.</span>
              ) }
            </div>
            <button type="button" id="userTradesBtn" className="user-btn" title="Trade History"  onClick={this.handleUserTradesBtn}>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </button>
          </div>
        </div>
      );
    }
    
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      if (username === props.user.username) {
        navigate('/profile', { replace: true });
        return;
      }
    }
  }, []);
  
  return (
    <Profile type={props.type} user={props.user} navigate={navigate} username={username}/>
  );
}
