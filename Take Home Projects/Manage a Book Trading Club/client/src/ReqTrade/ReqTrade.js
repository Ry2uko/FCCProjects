import './ReqTrade.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

const sampleData = {
  userAName: 'Ry2uko',
  userABooks: [
    {
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      requestsCount: 9
    },
    {
      title: 'Everything is F*cked',
      author: 'Mark Manson',
      requestsCount: 0
    }
  ],
  userBName: 'Ry2ukoAlt',
  userBBooks: [
    {
      title: 'Howl\'s Moving Castle',
      author: 'Diana Wynne Jones',
      requestsCount: 6
    },
    {
      title: 'House of Many Ways',
      author: 'Diana Wynne Jones',
      requestsCount: 3
    },
    {
      title: 'Castle in The Air',
      author: 'Diana Wynne Jones',
      requestsCount: 1
    }
  ]
};

const ReqTradeContainer = ({ 
  type,
  userAName,
  userABooks,
  userBName,
  userBBooks
}) => {
  return (
    <div className="reqTrade-container">
      <div className="left-panel-container panel-container">
        <span className="reqTrade-tile-user">
          {
            type === 'trade-profile'
            ? <span className="trade-profile">{ userAName }</span>
            : <a href={ `/user/${userAName}` } className="request-user">{ userAName }</a>
          }
        </span>
        <div className="container-tile">
          <div className="request-book-container">
            { userABooks.map((book, index) => {
              return (
                <div className="request-book" key={index}>
                  { 
                    type === 'request' ? (
                      <div className="requests-count-container">
                        <span className="requests-count">{ book.requestsCount }</span>
                      </div>
                    ) : null
                  }
                  
                  <h4 className="book-name">{ book.title }</h4>
                  <span className="book-author-span">by <span className="book-author">{ book.author }</span></span>
                </div>
              )
            }) }
          </div>
        </div>
      </div>
      <button className="reqTrade-info-btn"><i className="fa-solid fa-repeat"></i></button>
      <div className="right-panel-container panel-container">
        <span className="reqTrade-tile-user">
          <a href={ `/user/${userBName}` } className="request-user">{userBName}</a>
        </span>
        <div className="container-tile">
          <div className="request-book-container">
            { userBBooks.map((book, index) => {
              return (
                <div className="request-book" key={index}>
                  { 
                    type === 'request' ? (
                      <div className="requests-count-container">
                        <span className="requests-count">{ book.requestsCount }</span>
                      </div>
                    ) : null
                  }
                  
                  <h4 className="book-name">{ book.title }</h4>
                  <span className="book-author-span">by <span className="book-author">{ book.author }</span></span>
                </div>
              )
            }) }
          </div>
        </div>
      </div>
    </div>
  );
}

class ReqTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      title: ''
    }

    this.renderInit = this.renderInit.bind(this);
  }

  componentDidMount() {
    this.renderInit();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.type, prevProps.type)) {
      this.renderInit()
    }
  }

  renderInit() {
    let type = this.props.type;
    this.setState({
      type: type.toLowerCase(),
      title: type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 's'
    });
    $('a.nav-link.active').removeClass('active');
    if (type === 'request') {
      $('a.nav-link[href="/requests"]').attr('class', 'nav-link active');
    } else if (type === 'trade') {
      $('a.nav-link[href="/trades"]').attr('class', 'nav-link active');
    }
    
  }

  render() {
    return (
      <div className="ReqTrade">
        <div className="title-banner">
          <h1 className="title">All {this.state.title}</h1>
        </div>
        <div className="reqTrades-container">
          <ReqTradeContainer 
            type={this.props.type}
            userAName={sampleData.userAName}
            userABooks={sampleData.userABooks}
            userBName={sampleData.userBName}
            userBBooks={sampleData.userBBooks}
          />
        </div>
      </div>
    );
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <ReqTrade navigate={navigate} type={props.type} />
  );
};
export { sampleData, ReqTradeContainer };