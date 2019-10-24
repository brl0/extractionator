import React from "react";
import CONSTANTS from "../../constants";
import buildPost from "../../extractionator_util";
import ReactJson from "react-json-view";
import queryString from 'query-string';

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
    if (url && url !== 'undefined') {
      var post = buildPost(url);
      fetch(CONSTANTS.ENDPOINT.GRAPHQL, post)
      .then(response => {
        if (!response.ok) {
          console.log(response);
          //throw Error(response.statusText);
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
        <ReactJson src={data} />
      </main>
    );
  }
}
