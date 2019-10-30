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
    if (url && url !== 'undefined') {
      const queries = buildQueries([
        ['website', 'url,title,description', url],
        ['urlQuery', 'domain,tld', url],
      ]);
      const post = buildPost(queries);
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
          var counter = 0;
          var dataset = [];
          for (var subq in subqs) {
            var data = result.data[subqs[subq]];
            var fields = Object.keys(data);
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
