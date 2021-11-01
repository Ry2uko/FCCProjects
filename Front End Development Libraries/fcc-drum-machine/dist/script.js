let keyNames = {
  // ["element"]
  "1": "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  "2": "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  "3": "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  "4": "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  "5": "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  "6": "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  "7": "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  "8": "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  "9": "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" };

let keys = Object.keys(keyNames);
let keysdown = {};

function playAudi(key) {
  var audio = new Audio(keyNames[key]);
  audio.play();
  audio.volume = 0.3;
}

class Drums extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "drum-pad-container" }, /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "7" }, "7"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "8" }, "8"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "9" }, "9"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "4" }, "4"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "5" }, "5"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "6" }, "6"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "1" }, "1"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "2" }, "2"), /*#__PURE__*/
      React.createElement("div", { className: "drum-pad", id: "3" }, "3")));


  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '' };

  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "container-fluid", id: "drum-machine" }, /*#__PURE__*/
      React.createElement("h1", { id: "title" }, /*#__PURE__*/React.createElement("a", { href: "javascript:void(0)" }, "Drum Machine")), /*#__PURE__*/
      React.createElement(Drums, null)));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));


$(document).ready(function () {
  $(document).keydown(e => {
    if (keysdown[e.key]) return;
    keysdown[e.key] = true;
    if (keys.includes(e.key)) {
      $(`#${e.key}`).toggleClass("active");
      playAudi(e.key);
    }
  });

  $(document).keyup(e => {
    delete keysdown[e.key];
    if (keys.includes(e.key)) {
      $(`#${e.key}`).toggleClass("active");
    }
  });

  $(".drum-pad").on("click", function () {
    playAudi($(this).attr("id"));
  });
});