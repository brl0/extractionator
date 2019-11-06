import React from "react";
import ReactJson from "react-json-view";
import queryString from 'query-string';

import CONSTANTS from "../../constants";

import buildPost, { buildQueries } from "../../extractionator_util";

export default class HTMLContentViewer extends ReactJson {
  constructor(props) {
    super(props);

    this.state = {
      data: { field: "value" },
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    console.log(url);
    if (url && url !== 'undefined') {
      var queryInfo = ['htmlContent', 'html', url];
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
      .then(data => this.setState({ data }));
    }
  }

  render() {
    const { data } = this.state;
    return (
      <main id="mainContent">

      </main>
    );
  }
}
