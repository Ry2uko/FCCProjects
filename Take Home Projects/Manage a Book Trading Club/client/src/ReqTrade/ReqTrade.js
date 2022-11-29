import './ReqTrade.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class ReqTrade extends React.Component {
  render() {
    return (
      <div className="ReqTrade">
        <h1>Request/Trade</h1>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <ReqTrade navigate={navigate} />
  );
}