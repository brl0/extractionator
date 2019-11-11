import React, { Component } from "react";
import queryString from 'query-string';
import { Helmet } from "react-helmet";
import classnames from "classnames";

import styles from './htmlraw.module.css';
import CONSTANTS from "../../constants";
import buildPost, { buildQueries } from "../../extractionator_util";

var beautify = require('js-beautify').html;

export default class HTMLRawViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "",
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    if (url) {
      var queryInfo = [['htmlContent', 'html', url]];
      const queries = buildQueries(queryInfo);
      const post = buildPost(queries);
      fetch(CONSTANTS.ENDPOINT.GRAPHQL, post)
      .then(response => {
        if (!response.ok) {
          console.log(response);
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const content = data.data.htmlContent.html.slice(2, -1).replace(/>/g, '>\n');
        this.setState({ data: content });
      });
    }
  }

  render() {
    const { data } = this.state;
    const html = beautify(data);
    return (
      <main id="mainContent">
        <Helmet>
          <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
        </Helmet>
        <hr />
        <pre className={classnames("prettyprint", styles.pre)}>
          {html}
        </pre>
        <hr />
      </main>
    );
  }
}
