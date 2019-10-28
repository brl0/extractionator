import React, { Component } from "react";
import queryString from 'query-string';
import ReactDOM from 'react-dom';
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


export default class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: { field: "value" },
      qs: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    const url = this.state.qs.url;
    console.log("URL:");
    console.log(url);
    if (url && url !== 'undefined') {
      console.log('http://localhost:3001/get_page/' + url);
      fetch('http://localhost:3001/get_page/' + url,)
      .then(response => {
        console.log("Response:");
        console.log(response);
        if (!response.ok) {
          console.log("Response NOT ok!");
          console.log(response);
          //throw Error(response.statusText);
        }
        const result = response.text();
        console.log("Result:");
        console.log(result);
        return result;
      })
      .then(data => this.setState({ data }));
    }
  }

  render() {
    const { data } = this.state;
    console.log(this.state);
    return (
      <main id="mainContent">      
      
        <link rel="stylesheet" type="text/css"
        href="https://cdn.datatables.net/v/dt/jq-3.3.1/dt-1.10.20/cr-1.5.2/kt-2.5.1/rr-1.2.6/sl-1.3.1/datatables.min.css" ></link>

        <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jq-3.3.1/dt-1.10.20/cr-1.5.2/kt-2.5.1/rr-1.2.6/sl-1.3.1/datatables.min.js"></script>

        <div dangerouslySetInnerHTML={{ __html: data }} />
      </main>
    );
  }
}
