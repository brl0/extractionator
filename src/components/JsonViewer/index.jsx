import React from "react";
import ReactJson from "react-json-view";
import queryString from 'query-string';

import { axiosFullQueryPost } from "../../extractionator_util";

const axios = require('axios');

export default class JsonViewer extends ReactJson {
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
    if (url) {
      const post = axiosFullQueryPost(url);
      axios(post)
      .then(data => {
        const content = data.data;
        this.setState({ data: content });
      })
      .catch(error => {
        console.log(error);
        throw Error(error);
      });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <main id="mainContent">
        <ReactJson src={data} />
      </main>
    );
  }
}
