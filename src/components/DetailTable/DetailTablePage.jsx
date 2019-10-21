import React, { Component } from "react";
import classnames from "classnames";
import styles from "./detailtable.module.css";

//https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa
const $ = require("jquery");
//https://datatables.net/
$.DataTable = require("datatables.net");

export default class TableViewer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      details: props.details,
      longDescription: props.details["longDescription"],
      title: props.details["title"],
      status: props.details["status"],
      shipTo: props.details["shipTo"],
      orderTotal: props.details["orderTotal"],
      orderDate: props.details["orderDate"]
    };
    console.log("constructor", props);
    //this.handleDisplayTabClick = this.handleDisplayTabClick.bind(this);
  }

  componentDidMount() {
    console.log("props", this.props);
    console.log("state", this.state);
  }

  //shouldComponentUpdate() {}
  //handleChange(e) {}

  render() {
    return (
      <div className="col">
        <div className={ classnames("row", styles.heading) }>
          <div className="col">
            <h3 className="ml-3 mb-4">{ this.state.title }</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white mb-0">
                <li className="breadcrumb-item">
                  <a className={ styles.breadCrumbLink } href="/Master_Detail">
                    Master_Detail
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  { this.state.title }
                </li>
              </ol>
            </nav>
          </div>
          <div className="col-md-8 col-12 ml-3 mb-5">
            <p className={ styles.title }>Status</p>
            <p>{ this.state.status }</p>
            <p className={ styles.title }>Order Date</p>
            <p>{ this.state.orderDate }</p>
            <p className={ styles.title }>Ship To</p>
            <p>{ this.state.shipTo }</p>
            <p className={ styles.title }>Order Total</p>
            <p>{ this.state.orderTotal }</p>
            <p className={ styles.title }>Description</p>
            <p>{ this.state.longDescription }</p>
          </div>
        </div>
      </div>
    );
  }
}
