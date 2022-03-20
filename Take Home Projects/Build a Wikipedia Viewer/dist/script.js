// Hacked by Ry2uko ;}
function Random() {
  return /*#__PURE__*/(
    React.createElement("div", { className: "container otop-container" }, /*#__PURE__*/
    React.createElement("p", null, "or"), /*#__PURE__*/
    React.createElement("p", { className: "link" }, /*#__PURE__*/
    React.createElement("a", { href: "https://en.wikipedia.org/wiki/Special:Random", target: "_blank" }, "Click here for a random article"))));



}

function NoResult() {
  return /*#__PURE__*/(
    React.createElement("div", { className: "container nores-container" }, /*#__PURE__*/
    React.createElement("p", null, "No result.")));


}

class Article extends React.Component {
  componentDidMount() {
    $('.article').on('click', e => {
      const articleId = $(e.currentTarget).attr('articleId');
      window.open(`https://en.wikipedia.org/?curid=${articleId}`, '_blank');
    });
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "article-container container" },
      this.props.keys.map(i => {
        const article = this.props.articles[i];
        return /*#__PURE__*/(
          React.createElement("div", { className: "article", key: i, articleId: i }, /*#__PURE__*/
          React.createElement("h4", null, article.title), /*#__PURE__*/
          React.createElement("p", null, article.extract)));


      })));


  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderComponent: /*#__PURE__*/React.createElement(Random, null) };

  }

  handleClick() {
    const inputVal = document.getElementById('search').value;
    if (inputVal.length < 1) {
      return this.setState({
        renderComponent: /*#__PURE__*/React.createElement(Random, null) });

    };

    $.ajax({
      type: 'GET',
      url: `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${inputVal}`,
      dataType: 'jsonp',
      success: data => {
        if (!data.query) {
          return this.setState({
            renderComponent: /*#__PURE__*/React.createElement(NoResult, null) });

        }
        this.setState({
          renderComponent: /*#__PURE__*/React.createElement(Article, { articles: data.query.pages, keys: Object.keys(data.query.pages) }) });

      } });


  }

  componentDidMount() {
    $('#search').on('keypress', e => {
      if (e.key === "Enter") $('#searchBtn').click();
    });
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "container-fluid" }, /*#__PURE__*/
      React.createElement("h1", null, /*#__PURE__*/React.createElement("a", { target: "_blank", href: "https://en.wikipedia.org/" }, /*#__PURE__*/React.createElement("img", { alt: "logo", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/2244px-Wikipedia-logo-v2.svg.png" }), "Wikipedia Viewer")), /*#__PURE__*/
      React.createElement("div", { className: "container search-container" }, /*#__PURE__*/
      React.createElement("div", { className: "input-group" }, /*#__PURE__*/
      React.createElement("input", { type: "text", placeholder: "Search for an article", className: "form-control shadow-none", id: "search", autocomplete: "off" }), /*#__PURE__*/
      React.createElement("button", { className: "btn btn-secondary shadow-none", type: "button", id: "searchBtn", onClick: this.handleClick.bind(this) }, /*#__PURE__*/
      React.createElement("i", { class: "fa-solid fa-magnifying-glass" })))),



      this.state.renderComponent));


  }}


ReactDOM.render( /*#__PURE__*/
React.createElement(App, null),
document.getElementById('root'));