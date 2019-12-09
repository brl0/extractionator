import React, { Component } from "react";
import classnames from "classnames";
import queryString from 'query-string';

import WarningMessage from "../WarningMessage";
import MasterDetailPage from "./MasterDetailPage";
import MasterDetailSideBarTab from "./MasterDetailSideBarTab";
import styles from "./masterdetail.module.css";
import CONSTANTS from "../../constants";
import buildPost, { buildQueries, } from "../../extractionator_util";

var Spinner = require('react-spinkit');

export default class Tabbed_Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayTabIndex: 0,
      doneLoading: false,
      data: {
        "empty": 0,
    },
      qs: queryString.parse(this.props.location.search),
    };
    this.handleDisplayTabClick = this.handleDisplayTabClick.bind(this);
    this.handleWarningClose = this.handleWarningClose.bind(this);
  }

  // Get the sample data from the back end
  componentDidMount() {
    const url = this.state.qs.url;
    if (url && url !== 'undefined') {
      var queryInfo = [];
      for (let [key, value] of Object.entries(CONSTANTS.TYPES)) {
        queryInfo.push([key, value, url]);
      }
      const queries = buildQueries(queryInfo);
      const post = buildPost(queries);
      fetch(CONSTANTS.ENDPOINT.GRAPHQL, post)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(result => {
          this.setState({ data: result.data,
                          doneLoading: true });
        })
        .catch(error =>
          this.setState({
            WarningMessageOpen: true,
            WarningMessageText: `${
              CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET
            } ${error}`
          })
        );
    }
  }

  handleWarningClose() {
    this.setState({
      WarningMessageOpen: false,
      WarningMessageText: ""
    });
  }

  handleDisplayTabClick(id) {
    this.setState({ currentDisplayTabIndex: id });
  }

  render() {
    const {
      currentDisplayTabIndex,
      data,
      doneLoading,
      WarningMessageOpen,
      WarningMessageText
    } = this.state;
    var index = 0;
    if (!doneLoading) {
      return (
        <div className="row justify-content-center py-5" >
          <Spinner name='pacman' />
        </div>
      );
    }
    else {
    return (
      <main id="mainContent">
        <div className="container-fluid">
          <div className="row">
            <div
              className={classnames(
                "col-2",
                "p-0",
                "border-right",
                styles.sidebar
              )}
            >
              <div className="list-group list-group-flush border-bottom">
              {Object.keys(data).map((key) => (
                  <MasterDetailSideBarTab
                    onDisplayTabClick={this.handleDisplayTabClick}
                    tabText={key}
                    index={index++}
                    key={key.id}
                  />))
                }
              </div>
            </div>
            <MasterDetailPage
              data={data[Object.keys(data)[currentDisplayTabIndex]]}
              title={Object.keys(data)[currentDisplayTabIndex]}
              />
          </div>
        </div>
        <WarningMessage
          open={WarningMessageOpen}
          text={WarningMessageText}
          onWarningClose={this.handleWarningClose}
        />
      </main>
    );}
  }
}
