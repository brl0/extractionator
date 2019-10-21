import React, { Component } from "react";
import classnames from "classnames";
import WarningMessage from "../WarningMessage";
import DetailPage from "./DetailPage";
import DetailSideBarTab from "./DetailSideBarTab";
import GreyAvatar from "../../images/GreyAvatar.svg";
import styles from "./detail.module.css";
import CONSTANTS from "../../constants";

export default class DetailViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayTabIndex: 0,
      prevDisplayTabIndex: 1,
      detailText: [
        {
          shortDescription: "",
          longDescription: "",
          title: "",
          status: "",
          shipTo: "",
          orderTotal: 0.0,
          orderDate: "",
          id: 0
        }
      ]
    };
    this.handleDisplayTabClick = this.handleDisplayTabClick.bind(this);
    this.handleWarningClose = this.handleWarningClose.bind(this);
  }

  // Get the sample data from the back end
  componentDidMount() {
    fetch(CONSTANTS.ENDPOINT.MASTERDETAIL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        this.setState({ detailText: result });
      })
      .catch(error =>
        this.setState({
          WarningMessageOpen: true,
          WarningMessageText: `${CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET} ${error}`
        })
      );
  }

  handleWarningClose() {
    this.setState({
      WarningMessageOpen: false,
      WarningMessageText: ""
    });
  }

  handleDisplayTabClick(id) {
    console.log("Click id", id);
    console.log(
      "Click currentDisplayTabIndex",
      this.state.currentDisplayTabIndex
    );
    this.setState({ currentDisplayTabIndex: id });
  }

/*
  shouldComponentUpdate() {
    console.log("currentDisplayTabIndex", this.state.currentDisplayTabIndex);
    console.log("prevDisplayTabIndex", this.state.prevDisplayTabIndex);
    if (this.state.currentDisplayTabIndex !== this.state.prevDisplayTabIndex) {
      this.setState({ prevDisplayTabIndex: this.state.currentDisplayTabIndex });
      console.log("update true", this.state.prevDisplayTabIndex);
      return true;
    }
    console.log("update false");
    return false;
  }
*/
  render() {
    const {
      detailText,
      currentDisplayTabIndex,
      WarningMessageOpen,
      WarningMessageText
    } = this.state;
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
                {detailText.map((textAssets, index) => (
                  <DetailSideBarTab
                    onDisplayTabClick={this.handleDisplayTabClick}
                    tabText={textAssets.title}
                    image={GreyAvatar}
                    index={index}
                    key={textAssets.id}
                  />
                ))}
              </div>
            </div>
            <DetailPage
              onDisplayTabClick={ this.handleDisplayTabClick }
              details={detailText[currentDisplayTabIndex]} />
          </div>
        </div>
        <WarningMessage
          open={WarningMessageOpen}
          text={WarningMessageText}
          onWarningClose={this.handleWarningClose}
        />
      </main>
    );
  }
}
