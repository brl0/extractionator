import React from "react";
import ReactJson from "react-json-view";
import classnames from "classnames";
import styles from "./masterdetail.module.css";

export default function MasterDetailPage(props) {
  const {
    data,
    title
  } = props;
  return (
    <div className="col">
      <div className={classnames("row", styles.heading)}>
        <div className="col">
          <h3 className="ml-3 mb-4">Query type: {title}</h3>
          <p>URL: {data.url}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 col-12 ml-3 mb-5">
          <ReactJson src={data} />
        </div>
      </div>
    </div>
  );
}
