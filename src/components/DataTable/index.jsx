import React, { Component } from "react";
import CONSTANTS from "../../constants";
import queryString from 'query-string';
import buildPost from "../../extractionator_util";

//https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa
var $ = require("jquery");
//https://datatables.net/
$.DataTable = require("datatables.net");
require( 'datatables.net-dt' );
require( 'datatables.net-buttons/js/buttons.colVis.js' );
require( 'datatables.net-colreorder-dt' );
require( 'datatables.net-keytable-dt' );
require( 'datatables.net-rowreorder-dt' );
require( 'datatables.net-scroller-dt' );
require( 'datatables.net-select-dt' );

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    var parts = undefined;
    if (this.state.qs.parts) {
      parts = `{${this.state.qs.parts}}`;
    }
    if (url && url !== 'undefined') {     
      const post = buildPost(url, parts);
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
          this.setState({ details: result.data.website });
          const table_cols = [{title: "index"}, {title: "field"}, {title: "count"}, {title: "value"}];
          const obj = this.state.details;
          const fields = Object.keys(obj);
          var dataset = [];
          for (var idx in fields) {
            const item = obj[fields[idx]];
            var count = item.length;
            dataset.push([
              idx, 
              fields[idx],
              count,
              item,
            ])
          }
          const table_opts = {
            ordering: true,
            paging: false,
            scrollY: 400,
            select: true,
            colReorder: true,
            rowReorder: true,
            keys: true,
          };
          $(this.refs.main).DataTable({
            dom: '<"data-table-wrapper"t>',
            data: dataset,
            columns: table_cols,
            ...table_opts,
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

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    $(".data-table-wrapper")
      .find("table")
      .DataTable()
      .destroy(true);
  }

  render() {
    return (
      <div>
        <table ref="main" />
      </div>
    );
  }
}
