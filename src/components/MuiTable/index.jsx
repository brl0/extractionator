import React, { Component } from "react";
import CONSTANTS from "../../constants";
import MUIDataTable from "mui-datatables";
import queryString from 'query-string';

import buildPost, { buildQueries, objectToArray, indexArray } from "../../extractionator_util";

var Spinner = require('react-spinkit');

export default class MuiTable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dataset: [],
      descriptions: [],
      links: [],
      requestInfo: [],
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const url = qs.url;
    if (url && url !== 'undefined') {
      const queries = buildQueries([
        ['website', 'url,title,description', url],
        ['urlQuery', 'domain,tld', url],
        ['links', 'links', url],
        ['requestInfo', 'requestInfo', url],
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
          this.setState({
            dataset: objectToArray(result.data),
            descriptions: result.data.website.description,
            links: result.data.links.links,
            requestInfo: result.data.requestInfo.requestInfo,
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
    const tableCols = ["index", "field", "value"];
    const options = { filterType: 'checkbox', };
    const descs = indexArray(this.state.descriptions.map(Array));
    const requestInfo = indexArray(this.state.requestInfo)
    var links = indexArray(this.state.links);
    if (!this.state.dataset.length) {
      return (
        <div className="row justify-content-center px-5 py-5" >
          <Spinner name='pacman' />
        </div>
      )
    }
    else {
      return (
        <div>
          <MUIDataTable
            title="MUIDataTable"
            data={ this.state.dataset }
            columns={ tableCols }
            options={ options }
          />
          <MUIDataTable
            title="Links"
            data={ links }
            columns={ ['Index', 'Text', 'Link'] }
            options={ options }
          />
          <MUIDataTable
            title="Descriptions"
            data={ descs }
            columns={ ['Index', 'Description'] }
            options={ options }
          />
          <MUIDataTable
            title="RequestInfo"
            data={ requestInfo }
            columns={ ['Index', 'Field', 'Value'] }
            options={ options }
          />
        </div>
      );
    }
  }
}
