﻿import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import JsonViewer from "./components/JsonViewer";
import HTMLContentViewer from "./components/HTMLContent";
import MuiTable from "./components/MuiTable";
import Tabbed_Detail from "./components/Tabbed_Detail";
import Tabbed_Tables from "./components/Tabbed_Tables";
import Grid from "./components/Grid";
import List from "./components/List";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Redirect exact path="/" to="/Tabbed_Tables" />
          <Route path="/JsonViewer" component={JsonViewer} />
          <Route path="/HTMLContentViewer" component={HTMLContentViewer} />
          <Route path="/MuiTable" component={MuiTable} />
          <Route path="/Tabbed_Detail" component={Tabbed_Detail} />
          <Route path="/Tabbed_Tables" component={Tabbed_Tables} />
          <Route path="/Grid" component={Grid} />
          <Route path="/List" component={List} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
