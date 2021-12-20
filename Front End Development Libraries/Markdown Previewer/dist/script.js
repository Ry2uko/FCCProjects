function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Project by @Ry2uko

let placeholder = `# Markdown Previewer
You can type **anything** you want like links, headers, subheaders, list, and more. 

## I'm a H2 Element
This is an *inline code*: \`console.log('Hello React')\`  
And this is a *code block*:  
\`\`\`
function returnFname(fullName) {
  return fullName.split(' ')[0];
}
\`\`\`

### I'm a H3 Element
There are also different types of *lists*:
1. **Unordered**  
  Things I like:
    - Coffee
    - Reading
    - Games
2. **Ordered**  
  This is an ordered list! :O
    
#### I'm a H4 Element
Learn more about markdown and [syntaxes](https://en.wikipedia.org/wiki/Syntax_(programming_languages)):  
**<a href="https://www.markdownguide.org/basic-syntax/" target="_blank">Click me!</a>**
<!--
I'm using html here instead of []() because
I you can't add target="_blank" in markdown:) 
-->

##### I'm a H5 Element
Here is a quote from my favorite author: *William Shakespeare*  
> Though she be but little, she is fierce.  

###### I'm a H6 Element
You can also add images here:  
<span class='chibi'>
![monikachibi](https://www.nicepng.com/png/detail/938-9382210_ddlc-doki-doki-literature-club-monika-chibi.png)
![sayorichibi](https://www.seekpng.com/png/detail/144-1449329_delighted-cinnamon-bun-chibi-doki-doki-literature-club.png)
</span>  
Just like that!

You can start creating your own markdown too!  
Just remove everything and *let your mind go wild!*    
**ENJOY!**
`;

class Previewer extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { class: "preview-container" }, /*#__PURE__*/
      React.createElement("div", {
        id: "preview",
        dangerouslySetInnerHTML: {
          __html: marked(this.props.input) } })));




  }}


class Editor extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { class: "editor-div" }, /*#__PURE__*/
      React.createElement("textarea", { id: "editor",
        onChange: this.props.handleChange,
        value: this.props.input,
        spellcheck: "false" })));


  }}


class App extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "handleChange",




    e => {
      this.setState({
        input: e.target.value });

    });this.state = { input: placeholder };}
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "body-container" }, /*#__PURE__*/
      React.createElement(Editor, { handleChange: this.handleChange,
        input: this.state.input }), /*#__PURE__*/
      React.createElement(Previewer, { input: this.state.input })));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));