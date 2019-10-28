import React, { Component } from "react";
import CONSTANTS from "../../constants";
import MUIDataTable from "mui-datatables";
import queryString from 'query-string';

import buildPost from "../../extractionator_util";

export default class MuiTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: [],
      descriptions: [],
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const url = qs.url;
    var parts = undefined;
    if (qs.parts) {
      parts = `{${qs.parts}}`;
    }
    if (url && url !== 'undefined') {
      const post = buildPost(url, parts);
      const fetch_request = [CONSTANTS.ENDPOINT.GRAPHQL, post];
      fetch(...fetch_request)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(result => {
          const data = result.data.website;
          const fields = Object.keys(data);
          var dataset = [];
          var counter = 0;
          for (var idx in fields) {
            var item = data[fields[idx]];
            if (item instanceof Array
                && item.length >= 1 ) {
              for (var it in item) {
                dataset.push([
                  counter, 
                  fields[idx],
                  item[it],
                ]);
                counter += 1;
              }
            }
            else {
              dataset.push([
                counter, 
                fields[idx],
                item,
              ]);
              counter += 1;
            }
          }
          this.setState({
            dataset: dataset,
            descriptions: data.description,
          });
        })
        .catch(error =>
          this.setState({
            WarningMessageOpen: true,
            WarningMessageText: `${CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET} ${error}`
          })
        );
    }
  }

  render() {
    const table_cols = ["index", "field", "value"];
    const options = {filterType: 'checkbox',};
    const descs = this.state.descriptions.map(Array)
    return (
      <div>
        <MUIDataTable
          title="MUIDataTable"
          data={this.state.dataset}
          columns={table_cols}
          options={options}
        />
        <MUIDataTable
          title="Descriptions"
          data={descs}
          columns={['Description']}
          options={options}
        />
      </div>
    );
  }
}
