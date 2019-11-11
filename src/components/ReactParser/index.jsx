import React, { Component } from "react";
import queryString from 'query-string';

import { axiosBuildQueryPost } from "../../extractionator_util";

const axios = require('axios');
var HtmlToReactParser = require('html-to-react').Parser;

export default class ReactParser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qs: queryString.parse(this.props.location.search),
      reactElement: "",
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    if (url) {
      const queryInfo = [['textInfo', 'text', url]];
      const post = axiosBuildQueryPost(queryInfo);
      axios(post)
      .then(data => {
        const content = data.data.data.textInfo.text;
        var htmlToReactParser = new HtmlToReactParser();
        var reactElement = htmlToReactParser.parse(content);
        this.setState({ reactElement: reactElement })
      })
      .catch(error => {
        console.log(error);
        throw Error(error);
      });
    }
  }

  render() {
    const { reactElement } = this.state;
    return (
      <main id="mainContent">
        <hr />
        {reactElement}
        <hr />
      </main>
    );
  }
}
