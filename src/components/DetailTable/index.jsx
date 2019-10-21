import React, { Component } from "react";
import classnames from "classnames";
import WarningMessage from "../WarningMessage";
import DetailTablePage from "./DetailTablePage";
import DetailTableSideBarTab from "./DetailTableSideBarTab";
import GreyAvatar from "../../images/GreyAvatar.svg";
import styles from "./detailtable.module.css";
import CONSTANTS from "../../constants";

export default class DetailTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayTabIndex: 0,
      masterDetailText: [
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
        this.setState({ masterDetailText: result });
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
    this.setState({ currentDisplayTabIndex: id });
  }

  render() {
    const {
      masterDetailText,
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
                {masterDetailText.map((textAssets, index) => (
                  <DetailTableSideBarTab
                    onDisplayTabClick={this.handleDisplayTabClick}
                    tabText={textAssets.title}
                    image={GreyAvatar}
                    index={index}
                    key={textAssets.id}
                  />
                ))}
              </div>
            </div>
            <DetailTablePage
              details={masterDetailText[currentDisplayTabIndex]}
            />
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
