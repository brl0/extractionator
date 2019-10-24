﻿import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import "./DataTables/datatables.min.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Blank from "./components/Blank";
import JsonViewer from "./components/JsonViewer";
import TableViewer from "./components/TableViewer";
import TableView2 from "./components/TableView2";
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
          <Redirect exact path="/" to="/TableViewer" />
          <Route path="/Blank" component={Blank} />
          <Route path="/JsonViewer" component={JsonViewer} />
          <Route path="/TableViewer" component={TableViewer} />
          <Route path="/TableView2" component={TableView2} />
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
