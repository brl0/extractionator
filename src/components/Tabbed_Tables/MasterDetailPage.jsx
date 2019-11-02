import React from "react";
import classnames from "classnames";
import MUIDataTable from "mui-datatables";

import styles from "./masterdetail.module.css";
import { objectToArray } from "../../extractionator_util";


export default function MasterDetailPage(props) {
  const {
    data,
    title
  } = props;
  const table_cols = ["index", "field", "value"];
  const options = {filterType: 'checkbox',};
  return (
    <div className="col">
      <div className={classnames("row", styles.heading)}>
        <div className="col">
          <h3 className="ml-3 mb-4">Query type: {title}<p>URL: {data.url}</p></h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-white mb-0">
              <li className="breadcrumb-item">
                <a className={styles.breadCrumbLink} href="/Tabbed_Tables">
                  Tabbed_Tables
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        </div>
        <div className="col-md-8 col-12 ml-3 mb-5">
          <MUIDataTable
            title={title}
            data={objectToArray({data: data})}
            columns={table_cols}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}
