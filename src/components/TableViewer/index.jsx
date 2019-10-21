import React, { Component } from "react";
import CONSTANTS from "../../constants";

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
      masterDetailText: []
    };
  }

  componentDidMount() {
    fetch(CONSTANTS.ENDPOINT.MASTERDETAIL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        this.setState({ masterDetailText: result });

        var cols = Object.keys(this.state.masterDetailText[0]);
        var table_cols = [];
        for (var key in cols) {
          var col = { title: cols[key], data: cols[key] };
          table_cols.push(col);
        }

        $(this.refs.main).DataTable({
          dom: '<"data-table-wrapper"t>',
          data: this.state.masterDetailText,
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
