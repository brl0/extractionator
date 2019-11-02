import React, { Component } from "react";
import CONSTANTS from "../../constants";
import MUIDataTable from "mui-datatables";
import queryString from 'query-string';

import buildPost, {buildQueries, objectToArray} from "../../extractionator_util";


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
          console.log("RESULT:");
          console.log(result);
          this.setState({
            dataset: objectToArray(result.data),
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
