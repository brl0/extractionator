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

export default class DataTable2 extends Component {
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
          this.setState({ details: data });
          const table_cols = [{title: "index"}, {title: "field"}, {title: "value"}];
          const obj = this.state.details;
          console.log(obj.description);
          const fields = Object.keys(obj);
          var dataset = [];
          var counter = 0;
          for (var idx in fields) {
            var item = obj[fields[idx]];
            console.log(item.length);
            console.log(typeof(item));
            
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
          const table_opts = {
            ordering: true,
            paging: false,
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
