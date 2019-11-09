import React, { Component } from "react";
import queryString from 'query-string';

import CONSTANTS from "../../constants";

import { buildQueries } from "../../extractionator_util";

const axios = require('axios');

export default class TextViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: { field: "value" },
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    if (url && url !== 'undefined') {
      var queryInfo = [['textInfo', 'text', url]];
      const queries = buildQueries(queryInfo);
      //const post = buildPost(queries);
      axios({
        method: 'post',
        url: CONSTANTS.ENDPOINT.GRAPHQL,
        data: queries,
        headers: { 'Content-Type': 'application/json' },
      })
      .then(data => {
        const content = data.data.data.textInfo.text;
        this.setState({ data: content })
      })
      .catch(error => {
        console.log(error);
        throw Error(error);
      });
    }
  }

  render() {
    const { data } = this.state;
    const html = {__html: data};
    return (
      <main id="mainContent">
        <hr />
        <pre>
          <div dangerouslySetInnerHTML={html} />
        </pre>
        <hr />
      </main>
    );
  }
}
