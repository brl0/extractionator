﻿import React, { Component } from "react";
import queryString from 'query-string';

import CONSTANTS from "../../constants";
import buildPost, { buildQueries } from "../../extractionator_util";

export default class HTMLViewer extends Component {
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
        console.log(response);
        return response.json();
      })
      .then(data => {
        const content = data.data.htmlContent.html.slice(2,-1);
        console.log(content.normalize());
        this.setState({ data: content });
      });
    }
  }

  render() {
    const { data } = this.state;
    const html = {__html: data};
    return (
      <main id="mainContent">
        <hr />
        <div dangerouslySetInnerHTML={html}/>
        <hr />
      </main>
    );
  }
}
