import './NewRequest.sass';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class NewRequest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <></>
    );
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();

  return (
    <NewRequest user={props.user} navigate={navigate} />
  )
}