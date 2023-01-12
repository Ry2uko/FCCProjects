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