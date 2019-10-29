import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import "./DataTables/datatables.min.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Viewer from "./components/Blank";
import JsonViewer from "./components/JsonViewer";
import TableViewer from "./components/TableViewer";
import DataTable from "./components/DataTable";
import DataTable2 from "./components/DataTable2";
import MuiTable from "./components/MuiTable";
import DetailViewer from "./components/DetailViewer";
import DetailTable from "./components/DetailTable";
import Grid from "./components/Grid";
import Master_Detail from "./components/Master_Detail";
import List from "./components/List";
//TODO Web Template Studio: Add routes for your new pages here.
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Redirect exact path="/" to="/DataTable2" />
          <Route path="/Blank" component={Viewer} />
          <Route path="/JsonViewer" component={JsonViewer} />
          <Route path="/TableViewer" component={TableViewer} />
          <Route path="/DataTable" component={DataTable} />
          <Route path="/DataTable2" component={DataTable2} />
          <Route path="/MuiTable" component={MuiTable} />
          <Route path="/DetailViewer" component={DetailViewer} />
          <Route path="/DetailTable" component={ DetailTable } />
          <Route path="/Grid" component={Grid} />
          <Route path="/Master_Detail" component={Master_Detail} />
          <Route path="/List" component={List} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
