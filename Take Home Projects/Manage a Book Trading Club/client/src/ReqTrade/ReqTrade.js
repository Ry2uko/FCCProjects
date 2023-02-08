import './ReqTrade.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

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
          <div className="reqTrade-container">
            <div className="left-panel-container panel-container">
              <span className="reqTrade-tile-user">
                <a href="/"className="request-user">Ry2uko</a>
              </span>
              <div className="container-tile">
                <div className="request-book-container">
                  <div className="request-book">
                    <div className="requests-count-container">
                      <span className="requests-count">9</span>
                    </div>
                    <h4 className="book-name">The Subtle Art of Not Giving a F*ck</h4>
                    <span className="book-author-span">by <span className="book-author">Mark Manson</span></span>
                  </div>
                  <div className="request-book">
                    <h4 className="book-name">Everything is F*cked</h4>
                    <span className="book-author-span">by <span className="book-author">Mark Manson</span></span>
                  </div>
                </div>
              </div>
            </div>
            <button className="reqTrade-info-btn"><i className="fa-solid fa-repeat"></i></button>
            <div className="right-panel-container panel-container">
              <span className="reqTrade-tile-user">
                <a href="/" className="request-user">Ry2ukoAlt</a>
              </span>
              <div className="container-tile">
                <div className="request-book-container">
                  <div className="request-book">
                    <div className="requests-count-container">
                      <span className="requests-count">6</span>
                    </div>
                    <h4 className="book-name">Howl's Moving Castle</h4>
                    <span className="book-author-span">by <span className="book-author">Diana Wynne Jones</span></span>
                  </div>
                  <div className="request-book">
                    <div className="requests-count-container">
                      <span className="requests-count">3</span>
                    </div>
                    <h4 className="book-name">House of Many Ways</h4>
                    <span className="book-author-span">by <span className="book-author">Diana Wynne Jones</span></span>
                  </div>
                  <div className="request-book">
                    <div className="requests-count-container">
                      <span className="requests-count">1</span>
                    </div>
                    <h4 className="book-name">Castle in The Air</h4>
                    <span className="book-author-span">by <span className="book-author">Diana Wynne Jones</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  console.log(props);
  return (
    <ReqTrade navigate={navigate} type={props.type} />
  );
}