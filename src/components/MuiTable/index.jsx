import React, { Component } from "react";
import CONSTANTS from "../../constants";
import MUIDataTable from "mui-datatables";
import queryString from 'query-string';

import buildPost, {buildQueries} from "../../extractionator_util";

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
      const queries = buildQueries([
        ['website', url, 'url,title,description'],
        ['urlQuery', url, 'domain,tld'],
      ]);
      console.log("Queries:");
      console.log(queries);
      const post = buildPost(queries);
      console.log("Post:")
      console.log(post);
      const fetch_request = [CONSTANTS.ENDPOINT.GRAPHQL, post];
      fetch(...fetch_request)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(result => {
          const subqs = Object.keys(result.data);
          console.log(`subqs: ${subqs}`);
          var counter = 0;
          var dataset = [];
          for (var subq in subqs) {
            console.log(`subq: ${subq}`);
            var data = result.data[subqs[subq]];
            console.log(`data: ${data}`);
            var fields = Object.keys(data);
            console.log(`fields: ${fields}`);
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
          }
          console.log("result.data:");
          console.log(result.data);
          this.setState({
            dataset: dataset,
            descriptions: result.data.website.description,
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
    console.log(`this.state.descriptions: ${this.state.descriptions}`);
    const descs = this.state.descriptions.map(Array);
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
