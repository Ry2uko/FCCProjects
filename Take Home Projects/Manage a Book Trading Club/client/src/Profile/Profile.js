import './Profile.sass';
import { ReqTradeContainer } from '../ReqTrade/ReqTrade';
import React from 'react';
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
  }

  handleUserBooksBtn() {
    let route = '/books';

    if (this.props.type === 'profile') route = '/profile/books';
    else if (this.props.type === 'user') route = `/user/${this.props.username}/books`;

    this.props.navigate(route);
  }

  renderReqTrade() {
    const formattedUserABooks = this.state.recentTrade.userABooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() == bookId);
      a.push(book);
      return a;
    }, []);

    const formattedUserBBooks = this.state.recentTrade.userBBooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() == bookId);
      a.push(book);
      return a;
    }, []);


    if (this.state.recentTrade.userA === this.state.user.username) {
      return <ReqTradeContainer 
        type="trade-profile"
        userA={this.state.recentTrade.userA}
        userABooks={formattedUserABooks}
        userB={this.state.recentTrade.userB}
        userBBooks={formattedUserBBooks}
        user={this.state.user}
      />;
    } else {
      return <ReqTradeContainer 
        type="trade-profile"
        userA={this.state.recentTrade.userB}
        userABooks={formattedUserBBooks}
        userB={this.state.recentTrade.userA}
        userBBooks={formattedUserABooks}
        user={this.state.user}
      />;
    }
    
  }

  componentDidMount() {
    let route = '';
    
    if (this.props.type === 'profile') route = `/users?id=${this.props.user.id}`;
    else if (this.props.type === 'user') route = `/users?username=${this.props.username}`;

    getData(route).then(({ user }) => {
      if (user.trades.length < 1) {
        this.setState({ user });
      } else {
        let recentTradeId = user.trades[user.trades.length-1];

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
                  { this.state.user.location ? (
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
            {
              this.props.type === 'profile' ? (
                <div className="profile-btn-container">
                  <button type="button" id="requestsBtn" className="profile-btn" title="Requests">
                    <i className="fa-solid fa-share"></i>
                  </button>
                  <button type="button" id="settingsBtn" className="profile-btn" title="Settings">
                    <i className="fa-solid fa-gear"></i>
                  </button>
                </div>
              ) : null
            }
          </div>
          <div className="recent-trade-container">
            <h2 className="recent-trade-title">Recent Trade</h2>
            <div className="recTrade-container">
              { this.state.recentTrade ? this.renderReqTrade() : (
                <span className="no-trades-text">No trades yet.</span>
              ) }
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
  let { username } = useParams();
  const navigate = useNavigate();

  if (props.user) {
    if (username === props.user.username) {
      navigate('/profile', { replace: true });
      return;
    }
  }
  
  return (
    <Profile type={props.type} user={props.user} navigate={navigate} username={username}/>
  );
}
