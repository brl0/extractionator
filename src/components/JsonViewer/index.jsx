import React from "react";
import CONSTANTS from "../../constants";
import ReactJson from "react-json-view";
import queryString from 'query-string';

export default class JsonViewer extends ReactJson {
  constructor(props) {
    super(props);

    this.state = {
      data: { field: "value" }
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (values.url) {
      fetch(CONSTANTS.ENDPOINT.JSON + "?url=" + encodeURI(values.url))
        .then(response => response.json())
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
