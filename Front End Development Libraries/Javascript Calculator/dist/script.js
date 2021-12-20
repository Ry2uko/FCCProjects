function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Project by @Ry2uko

import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

const keyVals = {
  // Numbers
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
  "zero": 0,

  // Operators
  "add": " + ",
  "subtract": " - ",
  "multiply": " * ",
  "divide": " / ",
  "equals": " = " };



let typeLock, disabled, mode, operatorLock;
mode = operatorLock = "";
typeLock = disabled = false;

class Calculator extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "add",









    id => {
      // Handle Equal for addition
      if (operatorLock === "equals") {
        // Spamming equal
        if (this.state.eqval !== "") {
          this.setState(prev => ({
            opval: parseFloat(prev.displayval),
            displayval: parseFloat(prev.displayval) + parseFloat(prev.eqval),
            displayop: `${prev.displayval} + ${prev.eqval} = ` }));

          return;
        }
        this.setState(prev => ({
          displayop: prev.displayop + prev.displayval + keyVals[id],
          eqval: prev.displayval }));

      } else {
        this.setState(prev => ({
          displayop: parseFloat(prev.displayval) + prev.opval + keyVals[id] }));

      }
      mode = "+";
      typeLock = true;
      operatorLock = id;
      this.setState(prev => ({
        opval: parseFloat(prev.displayval) + prev.opval,
        displayval: (parseFloat(prev.displayval) + prev.opval).toString() }));

    });_defineProperty(this, "subtract",


    id => {
      // Handle Equal for subtraction
      if (operatorLock === "equals") {
        // Spamming equal
        if (this.state.eqval !== "") {
          this.setState(prev => ({
            opval: parseFloat(prev.displayval),
            displayval: parseFloat(prev.displayval) - parseFloat(prev.eqval),
            displayop: `${prev.displayval} - ${prev.eqval} = ` }));

          return;
        }
        this.setState(prev => ({
          displayop: prev.displayop + prev.displayval + keyVals[id],
          eqval: prev.displayval }));

      } else {
        this.setState(prev => ({
          displayop: prev.opval - parseFloat(prev.displayval) + keyVals[id] }));

      }
      mode = "-";
      typeLock = true;
      operatorLock = id;
      this.setState(prev => ({

        opval: prev.opval - parseFloat(prev.displayval),
        displayval: (prev.opval - parseFloat(prev.displayval)).toString() }));

    });_defineProperty(this, "multiply",


    id => {
      // Handle Equal for multiplication
      if (operatorLock === "equals") {
        // Spamming Equal
        if (this.state.eqval !== "") {
          this.setState(prev => ({
            opval: parseFloat(prev.displayval),
            displayval: parseFloat(prev.displayval) * parseFloat(prev.eqval),
            displayop: `${prev.displayval} * ${prev.eqval} = ` }));

          return;
        }
        this.setState(prev => ({
          displayop: prev.displayop + prev.displayval + keyVals[id],
          eqval: prev.displayval }));

      } else {
        this.setState(prev => ({
          displayop: prev.opval * parseFloat(prev.displayval) + keyVals[id] }));

      }
      mode = "*";
      typeLock = true;
      operatorLock = id;
      this.setState(prev => ({
        opval: prev.opval * parseFloat(prev.displayval),
        displayval: (prev.opval * parseFloat(prev.displayval)).toString() }));

    });_defineProperty(this, "divide",


    id => {
      // Handle Equal for division
      if (operatorLock === "equals") {
        // Spamming Equal
        if (this.state.eqval !== "") {
          this.setState(prev => ({
            opval: parseFloat(prev.displayval),
            displayval: parseFloat(prev.displayval) / parseFloat(prev.eqval),
            displayop: `${prev.displayval} / ${prev.eqval} = ` }));

          return;
        }
        this.setState(prev => ({
          displayop: prev.displayop + prev.displayval + keyVals[id],
          eqval: prev.displayval }));

      } else {
        this.setState(prev => ({
          displayop: prev.opval / parseFloat(prev.displayval) + keyVals[id] }));

      }
      // n / 0 is undefined
      if (this.state.displayval === "0") {
        this.zerodivide();
        return;
      }
      mode = "/";
      typeLock = true;
      operatorLock = id;
      this.setState(prev => ({
        opval: prev.opval / parseFloat(prev.displayval),
        displayval: (prev.opval / parseFloat(prev.displayval)).toString() }));

    });_defineProperty(this, "changeOperator",


    id => {
      this.setState(prev => ({
        displayop: prev.displayval + keyVals[id],
        eqval: "",
        opval: parseFloat(prev.displayval) }));

    });_defineProperty(this, "zerodivide",
    () => {
      disabled = true;
      document.getElementById("zerodivide").style.display = "block";
      document.getElementById("cleareverything").style.backgroundColor = "rgba(138, 132, 226, 0.4)";
      this.setState(prev => ({
        displayop: "",
        displayval: (prev.opval / parseFloat(prev.displayval)).toString(),
        opval: 0 }));

    });_defineProperty(this, "clearEverything",

    () => {
      if (disabled) {
        disabled = false;
        document.getElementById("zerodivide").style.display = "none";
        document.getElementById("cleareverything").style.backgroundColor = "rgba(77, 187, 255, 0.2)";
      }
      mode = "";
      typeLock = false;
      operatorLock = "";
      this.setState({
        displayop: "",
        displayval: "0",
        opval: 0,
        eqval: "" });

    });_defineProperty(this, "autoCalcu",

    id => {
      switch (mode) {
        case "+":
          this.add(id);
          break;
        case "-":
          this.subtract(id);
          break;
        case "*":
          this.multiply(id);
          break;
        case "/":
          this.divide(id);
          break;}

    });this.state = { displayval: "0", displayop: "", eqval: "", opval: 0 };} // Addition


  componentDidMount() {
    let component = this; // access state
    let numkeys = document.querySelectorAll(".num");
    let opkeys = document.querySelectorAll(".op");
    numkeys.forEach(numFn);
    opkeys.forEach(opFn);

    function numFn(e) {
      e.addEventListener("click", () => {
        if (disabled) return;
        if (operatorLock === "equals" && typeLock) {
          component.clearEverything();
        }
        switch (e.id) {
          case "zero":
            //Prevent zero at the start of input
            if (component.state.displayval === "0") {
              typeLock = false;
              operatorLock = "";
              break;
            }


          default:
            if (component.state.displayval === "0" || typeLock) {
              typeLock = false;
              operatorLock = "";
              component.setState(prev => ({
                displayval: "" }));

            }
            component.setState(prev => ({
              displayval: prev.displayval.toString() + keyVals[e.id] }));}


      });
    }

    function opFn(e) {
      e.addEventListener("click", () => {
        if (disabled) {
          if (e.id === "cleareverything") component.clearEverything();
          return;
        }
        switch (e.id) {

          case "cleareverything":
            component.clearEverything();
            break;

          case "clear":
            if (operatorLock === "equals" && typeLock) {
              component.clearEverything();
              break;
            }
            typeLock = false;
            component.setState({
              displayval: "0" });

            break;

          case "del":
            // Prevents deleting 'invisible' numbers
            if (typeLock) break;

            // Display '0' when deleted all num
            if (component.state.displayval.length <= 1 || component.state.displayval.length === 2 && component.state.displayval[0] === "-") {
              component.setState(prev => ({
                displayval: "0" }));

              break;
            }

            component.setState(prev => ({
              displayval: prev.displayval.slice(0, -1) }));

            break;

          case "decimal":
            if (typeLock) {
              typeLock = false;
              operatorLock = "";
              component.setState(prev => ({
                displayval: "0." }));

            }
            if (parseFloat(component.state.displayval) % 1 === 0 && component.state.displayval.slice(-1) !== ".") {
              component.setState(prev => ({
                displayval: prev.displayval + "." }));

            }
            break;


          case "add":
            // Prevents spamming operator
            if (operatorLock === "add") break;


            // For changing operators: 12 + => 12 -
            if (typeLock) {
              mode = "+";
              operatorLock = e.id;
              component.changeOperator(e.id);
              break;
            }

            // Mixing Operators: 12 + 6 -  -> 18 - (not 6)
            if (mode !== "+" && mode !== "") {
              component.autoCalcu(e.id);
              mode = "+";
              operatorLock = "add";
              break;
            }

            component.add(e.id);
            break;

          case "subtract":
            // Prevents spamming operator
            if (operatorLock === "subtract") {
              break;
            }

            // For changing operators
            if (typeLock) {
              mode = "-";
              operatorLock = e.id;
              component.changeOperator(e.id);
              break;
            }

            // Mixing Operators
            if (mode !== "-" && mode !== "") {
              component.autoCalcu(e.id);
              mode = "-";
              operatorLock = "subtract";
              break;
            }

            // Prevents subtracting from zero at start: -96 -  -> 96 -
            if (component.state.displayop === "") {
              mode = "-";
              typeLock = true;
              operatorLock = e.id;
              component.setState(prev => ({
                displayop: prev.displayval + keyVals[e.id],
                opval: parseFloat(prev.displayval) }));

              break;
            }

            component.subtract(e.id);
            break;

          case "multiply":
            // Prevents spamming operator
            if (operatorLock === "multiply") break;

            // For changing operators
            if (typeLock) {
              mode = "*";
              operatorLock = e.id;
              component.changeOperator(e.id);
              break;
            }

            // Mixing Operators
            if (mode !== "*" && mode !== "") {
              component.autoCalcu(e.id);
              mode = "*";
              operatorLock = "multiply";
              break;
            }

            // Prevents from multiplying from zero at start
            if (component.state.displayop === "") {
              component.setState({
                opval: 1 });

            }

            component.multiply(e.id);
            break;

          case "divide":
            //Prevents spamming operator
            if (operatorLock === "divide") break;

            // For changing operators
            if (typeLock) {
              mode = "/";
              operatorLock = e.id;
              component.changeOperator(e.id);
              break;
            }

            if (mode !== "/" && mode !== "") {
              component.autoCalcu(e.id);
              mode = "/";
              operatorLock = "divide";
              break;
            }

            // Prevents from dividing from zero at start
            if (component.state.displayop === "") {
              mode = "/";
              typeLock = true;
              operatorLock = e.id;
              component.setState(prev => ({
                displayop: prev.displayval + keyVals[e.id],
                opval: parseFloat(prev.displayval) }));

              break;
            }

            component.divide(e.id);
            break;

          case "plus-minus":
            if (typeLock) break;
            if (component.state.displayval === "0") typeLock = true;
            component.setState(prev => ({
              displayval: (parseFloat(prev.displayval) * -1).toString() }));

            break;

          case "equals":
            // n =
            if (mode === "") {
              typeLock = true;
              component.setState(prev => ({
                displayop: prev.displayval + keyVals[e.id] }));

              break;
            }

            operatorLock = e.id;
            component.autoCalcu(e.id);
            break;}

      });
    }

  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement("div", { id: "display-container" }, /*#__PURE__*/
      React.createElement("div", { class: "text-display" }, /*#__PURE__*/
      React.createElement("span", { id: "display" }, this.state.displayval)), /*#__PURE__*/

      React.createElement("div", { class: "textop" }, /*#__PURE__*/
      React.createElement("a", { target: "_blank", href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:foundation-algebra/x2f8bb11595b61c86:division-zero/v/why-dividing-by-zero-is-undefined", id: "zerodivide" }, "Know why dividing by 0 is undefined or infinity"), /*#__PURE__*/
      React.createElement("span", { id: "ot" }, this.state.displayop))), /*#__PURE__*/


      React.createElement("div", { id: "keypad" }, /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "cleareverything" }, "CE"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "clear" }, "C"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "del" }, "DEL"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "divide" }, " /"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "seven" }, "7"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "eight" }, "8"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "nine" }, "9"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "multiply" }, "*"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "four" }, "4"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "five" }, "5"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "six" }, "6"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "subtract" }, "-"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "one" }, "1"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "two" }, "2"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "three" }, "3"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "add" }, "+"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "plus-minus" }, "+/-"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key num", id: "zero" }, "0"), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "decimal" }, "."), /*#__PURE__*/
      React.createElement("button", { type: "button",
        class: "key op", id: "equals" }, "="))));




  }}
;

const rootElement = document.getElementById("root");
ReactDOM.render( /*#__PURE__*/React.createElement(Calculator, null), rootElement);