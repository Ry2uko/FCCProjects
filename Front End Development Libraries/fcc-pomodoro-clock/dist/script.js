function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Project by @Ry2uko

import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

let isRunning = false;
let intervalInProgress = false;
let currMode = "session";

let colorSet = {}; // tbu

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "handleHover",














































    type => {
      let bgcolor = this.bgsessiondefault;
      if (currMode === "break") bgcolor = this.bgbreakdefault;
      if (type === "enter") {
        this.startStop.style.backgroundColor = bgcolor;
        this.startStop.style.color = "rgb(253, 254, 251)";
      } else {
        this.startStop.style.backgroundColor = "rgb(253,254,251)";
        this.startStop.style.color = bgcolor;
      }
    });_defineProperty(this, "startTimer",


    () => {
      if (isRunning) {
        this.setState({
          startStop: "Start" });

        isRunning = false;
        return;
      }
      this.setState({
        startStop: "Stop" });


      isRunning = true;
      if (!intervalInProgress) {
        this.setTimer();
        this.setState({
          timerInterval: setInterval(() => this.timerFoo(), 1000) });

        intervalInProgress = true;
      }

    });_defineProperty(this, "resetTimer",

    () => {
      this.setState({
        startStop: "Start" });

      isRunning = false;
      intervalInProgress = false;
      this.setTimer();
      clearInterval(this.state.timerInterval);
    });_defineProperty(this, "lessThanTen",

    int => {
      if (isRunning && intervalInProgress) return;
      this.setState({
        minutes: int,
        seconds: 0,
        disSec: "00" });

      if (int < 10) {
        this.setState(prev => ({
          disMin: "0" + int }));

      } else {
        this.setState(prev => ({
          disMin: int.toString() }));

      }
      this.setState(prev => ({
        time: `${prev.disMin}:${prev.disSec}` }));

    });_defineProperty(this, "setTimer",

    () => {
      let currMin = this.state.sessionMin;
      if (currMode === "break") {
        currMin = this.state.breakMin;
      };
      this.lessThanTen(currMin);
    });_defineProperty(this, "setColor",

    bgcolor => {
      document.body.style.background = bgcolor;
      this.startStop.style.color = bgcolor;
      this.sessionInc.style.background = bgcolor;
      this.sessionDec.style.background = bgcolor;
      this.breakInc.style.background = bgcolor;
      this.breakDec.style.background = bgcolor;
    });_defineProperty(this, "changeMode",

    (mode, color) => {
      if (currMode === mode || isRunning) return;
      if (mode === "session") {
        currMode = "session";
        let bgcolor = this.bgsessiondefault;
        this.sessionLabel.style.color = "rgba(253, 254, 251, 1)";
        this.breakLabel.style.color = "rgba(253, 254, 251, 0.6)";
        this.setColor(bgcolor);

      } else {
        currMode = "break";
        let bgcolor = this.bgbreakdefault;
        this.sessionLabel.style.color = "rgba(253, 254, 251, 0.6)";
        this.breakLabel.style.color = "rgba(253, 254, 251, 1)";
        this.setColor(bgcolor);
      }
      this.resetTimer();
    });_defineProperty(this, "minFoo",

    () => {
      if (this.state.minutes <= 10) {
        this.setState(prev => ({
          minutes: prev.minutes - 1,
          disMin: "0" + (prev.minutes - 1) }));

        return;
      }
      this.setState(prev => ({
        minutes: prev.minutes - 1,
        disMin: (prev.minutes - 1).toString() }));

    });_defineProperty(this, "secFoo",

    () => {
      if (this.state.seconds === 0) {
        this.setState(prev => ({
          seconds: 59,
          disSec: "59" }));

        this.minFoo();
        return;
      } else if (this.state.seconds <= 10) {
        this.setState(prev => ({
          seconds: prev.seconds - 1,
          disSec: "0" + (prev.seconds - 1) }));

        return;
      }
      this.setState(prev => ({
        seconds: prev.seconds - 1,
        disSec: (prev.seconds - 1).toString() }));

    });_defineProperty(this, "timerFoo",


    () => {
      // Returns if isRunning is false
      if (!isRunning) return;
      if (this.state.seconds === 0 && this.state.minutes === 0) {
        isRunning = false; // changeMode bypass
        if (currMode === "session") {
          this.changeMode("break");
        } else {
          this.changeMode("session");
        }
        return;
      }
      this.secFoo();
      this.setState(prev => ({
        time: `${prev.disMin}:${prev.disSec}` }));

    });_defineProperty(this, "skip",

    () => {
      let customTxt = "";
      if (isRunning) {
        customTxt = " early"; // just a bit of detail :)
      }
      if (confirm(`Are you sure you want to finish the ${currMode}${customTxt}?`)) {
        this.setState({
          startStop: "Start" });

        isRunning = false;
        if (currMode === "session") {
          this.changeMode("break");
          return;
        } else {
          this.changeMode("session");
        }
      }
    });_defineProperty(this, "countFunc",


    (mode, type) => {
      if (type === "increment") {
        if (mode === "session") {
          this.setState(prev => ({
            sessionMin: prev.sessionMin + 1 }));

          if (currMode === mode) this.lessThanTen(this.state.sessionMin + 1);
        } else {
          this.setState(prev => ({
            breakMin: prev.breakMin + 1 }));

          if (currMode === mode) this.lessThanTen(this.state.breakMin + 1);
        }
      } else {
        if (mode === "session") {
          if (this.state.sessionMin === 1) return;
          this.setState(prev => ({
            sessionMin: prev.sessionMin - 1 }));

          if (currMode === mode) this.lessThanTen(this.state.sessionMin - 1);
        } else {
          if (this.state.breakMin === 1) return;
          this.setState(prev => ({
            breakMin: prev.breakMin - 1 }));

          if (currMode === mode) this.lessThanTen(this.state.breakMin - 1);
        }
      }
    });this.state = { // Default Values
      sessionMin: 25, breakMin: 5, // Timer
      minutes: 25, seconds: 0, disMin: "25", disSec: "00", time: "25:00", // Misc
      startStop: "Start", timerInterval: 0 };}componentDidMount() {let sidebar = document.getElementById("sidebar");document.getElementById("settings").addEventListener("click", function () {sidebar.style.width = "320px";});document.getElementById("closebtn").addEventListener("click", function () {sidebar.style.width = "0";});this.sessionLabel = document.getElementById("timer-label");this.breakLabel = document.getElementById("timer-label2");this.startStop = document.getElementById("start_stop");this.sessionInc = document.getElementById("session-increment");this.sessionDec = document.getElementById("session-decrement");this.breakInc = document.getElementById("break-increment");this.breakDec = document.getElementById("break-decrement"); // color variables 
    // Default
    this.bgsessiondefault = "rgb(255,85,85)";this.bgbreakdefault = "#736CED"; // this.bgbreakdefault = "rgb(98, 188, 252)";
  } // Handles hover for btn
  render() {return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", { type: "button", id: "settings", className: "btn" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-cog" })), /*#__PURE__*/

    React.createElement("div", { id: "sidebar" }, /*#__PURE__*/
    React.createElement("a", { href: "javascript:void(0)", id: "closebtn" }, "\xD7"), /*#__PURE__*/
    React.createElement("div", { className: "settings-bar" }, /*#__PURE__*/
    React.createElement("span", { className: "settings-label" }, "Session Length"), /*#__PURE__*/
    React.createElement("div", { className: "settings-container" }, /*#__PURE__*/
    React.createElement("button", { type: "button",
      className: "settings-btn",
      id: "session-decrement",
      onClick: this.countFunc.bind(this, "session", "decrement") }, "-"), /*#__PURE__*/
    React.createElement("input", { type: "text",
      id: "session-length",
      className: "settings-input",
      value: this.state.sessionMin }), /*#__PURE__*/
    React.createElement("button", { type: "button",
      className: "settings-btn",
      id: "session-increment",
      onClick: this.countFunc.bind(this, "session", "increment") }, "+")), /*#__PURE__*/

    React.createElement("span", { className: "settings-label" }, "Break Length"), /*#__PURE__*/
    React.createElement("div", { className: "settings-container" }, /*#__PURE__*/

    React.createElement("button", { type: "button",
      className: "settings-btn",
      id: "break-decrement",
      onClick: this.countFunc.bind(this, "break", "decrement") }, "-"), /*#__PURE__*/
    React.createElement("input", { type: "text",
      id: "break-length",
      className: "settings-input",
      value: this.state.breakMin }), /*#__PURE__*/
    React.createElement("button", { type: "button",
      className: "settings-btn",
      id: "break-increment",
      onClick: this.countFunc.bind(this, "break", "increment") }, "+")))), /*#__PURE__*/




    React.createElement("h1", null, "Pomodoro Clock"), /*#__PURE__*/

    React.createElement("div", { id: "timer-container" }, /*#__PURE__*/

    React.createElement("div", { className: "timer" }, /*#__PURE__*/

    React.createElement("div", { className: "timer-label" }, /*#__PURE__*/
    React.createElement("span", { id: "timer-label",
      onClick: this.changeMode.bind(this, "session") }, "Session"), /*#__PURE__*/


    React.createElement("span", { id: "timer-label2",
      onClick: this.changeMode.bind(this, "break") }, "Break")), /*#__PURE__*/



    React.createElement("div", { className: "time-container" }, /*#__PURE__*/
    React.createElement("span", { id: "time-left" }, this.state.time))), /*#__PURE__*/




    React.createElement("div", { className: "controls" }, /*#__PURE__*/
    React.createElement("button", { type: "button",
      className: "btn",
      id: "reset",
      onClick: this.resetTimer }, /*#__PURE__*/
    React.createElement("i", { className: "fas fa-redo" })), /*#__PURE__*/

    React.createElement("button", { type: "button",
      className: "btn",
      id: "start_stop",
      onClick: this.startTimer,
      onMouseEnter: this.handleHover.bind(this, "enter"),
      onMouseLeave: this.handleHover.bind(this, "leave") },
    this.state.startStop), /*#__PURE__*/

    React.createElement("button", { type: "button",
      className: "btn",
      id: "skip",
      onClick: this.skip }, /*#__PURE__*/
    React.createElement("i", { className: "fas fa-forward" })))));






  }}




ReactDOM.render( /*#__PURE__*/React.createElement(Pomodoro, null), document.getElementById("root"));


// Seperate class: to do list