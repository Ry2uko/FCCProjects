import './UserTrades.sass';
import { ReqTradeContainer } from '../ReqTrade/ReqTrade';
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import $ from 'jquery';

// no trades yet

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class UserTrades extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      trades: null,
      books: null
    };

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenBookBtn = this.handleOpenBookBtn.bind(this);
  }

  handleOpenBookBtn(bookId) {
    let route = this.props.type === 'profile' ? '/profile/trades' : `/user/${this.props.username}/trades`;
    this.props.navigate(`/book/${bookId}`, { state: { route } });
  }

  handleBackBtn() {
    let route;
    if (this.props.navState) route = this.props.navState.route;

    if (route) {
      this.props.navigate(route);
    } else {
      if (this.props.type === 'profile') this.props.navigate('/profile');
      else this.props.navigate(`/user/${this.props.username}`);
    }
  }

  renderReqTrade(trade, index) {

    const formattedUserABooks = trade.userABooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() === bookId);
      a.push(book);
      return a;
    }, []);

    const formattedUserBBooks = trade.userBBooks.reduce((a, bookId) => {
      const book = this.state.books.find(book => book._id.toString() === bookId);
      a.push(book);
      return a;
    }, []);

    return <ReqTradeContainer
      type="trade-profile"
      userA={trade.userA}
      userABooks={formattedUserABooks}
      userB={trade.userB}
      userBBooks={formattedUserBBooks}
      user={this.state.user}
      key={index}
      reqTradeId={trade._id.toString()}
      handleOpenBookBtn={this.handleOpenBookBtn}
    />
  }

  componentDidMount() {
    let route = '';

    if (this.props.type === 'profile') route = `/users?id=${this.props.user.id}`;
    else if (this.props.type === 'user') route = `/users?username=${this.props.username}`;

    getData(route).then(({ user }) => {
      getData('/trades').then(({ trades }) => {
        const userTrades = user.trades;
        let stateTrades = [];
  
        userTrades.forEach(tradeId => {
          stateTrades.push(trades.find(trade => trade._id.toString() === tradeId));
        });
  
        this.setState({ trades: stateTrades });
      });

      this.setState({ user });
    });

    getData('/books').then(({ books }) => {
      this.setState({ books });
    })

    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.trades == null || this.state.books == null) {
      return (
        <div className="parent-container">
          <div className="UserTrades-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            { this.props.type === 'profile' ? (
              <h2 className="header-title">My Trades</h2>
            ) : (
              <h2 className="header-title">{this.props.username}'s Trades</h2>
            )}
          </div>
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
        <div className="UserTrades parent-container">
          <div className="UserTrades-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            { this.props.type === 'profile' ? (
              <h2 className="header-title">My Trades</h2>
            ) : (
              <h2 className="header-title">{this.props.username}'s Trades</h2>
            )}
          </div>
          <div className="trades-container">
            { this.state.trades.map((trade, index) => {
              return this.renderReqTrade(trade, index);
            })}
          </div>
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  if (props.user) {
    if (username === props.user.username) {
      navigate('/profile/trades', { replace: true });
      return;
    }
  }

  return (
    <UserTrades type={props.type} user={props.user} navigate={navigate} username={username} navState={state} />
  );
}