import React from "react";
// eslint-disable-next-line
import classnames from "classnames";
import styles from "./detail.module.css";

export default function DetailPage(props) {
  const details = props.details;
  return (
    Object.keys(details).map((item) => {
      return <div className="col">
      <div className="row">
      <div className="col-md-8 col-12 ml-3 mb-5">
      <p className={ styles.title }>
      { item }</p>
      <p>{details[item]}</p>
      </div></div></div>
    }
    )
  );
}
