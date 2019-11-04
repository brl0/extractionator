import React, { Component } from "react";
import classnames from "classnames";
import queryString from 'query-string';

import GridComponent from "./GridComponent";
import WarningMessage from "../WarningMessage";
import styles from "./grid.module.css";
import CONSTANTS from "../../constants";
import buildPost, {buildQueries} from "../../extractionator_util";

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      titles: [],
      WarningMessageOpen: false,
      WarningMessageText: ""
    };

    this.handleWarningClose = this.handleWarningClose.bind(this);
  }

  // Get the text sample data from the back end
  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const url = qs.url;
    if (url && url !== undefined) {
      const queries = buildQueries([
        ['website', 'image,title', url],
      ]);
      const post = buildPost(queries);
      const fetch_request = [CONSTANTS.ENDPOINT.GRAPHQL, post];
      fetch(...fetch_request)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(result => {
          this.setState({ images: result.data.website.image,
                          titles: result.data.website.title })
        })
        .catch(error =>
          this.setState({
            WarningMessageOpen: true,
            WarningMessageText: `Request to get grid text failed: ${error}`
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

  render() {
    const {
      images,
      titles,
      WarningMessageOpen,
      WarningMessageText
    } = this.state;
    const qs = queryString.parse(this.props.location.search);
    const url = qs.url;
    var index = 0;
    return (
      <main id="mainContent">
        <div className={classnames("text-center", styles.header)}>
          <h1>Images</h1>
          <p>{url}</p>
        </div>

        <div className="container">
          {titles.map(title => (
            <div className="row justify-content-center py-1">
              <h1>{title}</h1>
            </div>
          ))}

          <div className="row justify-content-around text-center pb-5">
            {images.map(image => (
              <GridComponent
                key={index++}
                url={url}
                image={image}
              />
            ))}
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
