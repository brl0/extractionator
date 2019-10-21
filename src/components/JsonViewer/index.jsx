import React from "react";
import CONSTANTS from "../../constants";
import ReactJson from "react-json-view";

export default class JsonViewer extends ReactJson {
  constructor(props) {
    super(props);

    this.state = {
      data: { field: "value" }
    };
  }

  componentDidMount() {
    fetch(CONSTANTS.ENDPOINT.MASTERDETAIL)
      .then(response => response.json())
      .then(data => this.setState({ data }));
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
