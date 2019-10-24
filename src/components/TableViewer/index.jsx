﻿import React, { Component } from "react";
import CONSTANTS from "../../constants";
import queryString from 'query-string';

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

export default class TableViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    if (url && url !== 'undefined') {
      fetch(CONSTANTS.ENDPOINT.JSON + "?url=" + encodeURI(url))
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(result => {
          this.setState({ details: result.website });
          var cols = Object.keys(this.state.details);
          var table_cols = [];
          for (var key in cols) {
            var col = { title: cols[key] };
            table_cols.push(col);
          };
          var d = [];
          for (var datakey in cols) {
            d.push(this.state.details[cols[datakey]])
          };
          var dataset = [d];
          $(this.refs.main).DataTable({
            dom: '<"data-table-wrapper"t>',
            data: dataset,
            columns: table_cols,
            ordering: true,
            paging: false,
            scrollY: 400,
            select: true,
            colReorder: true,
            rowReorder: true,
            keys: true,
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
