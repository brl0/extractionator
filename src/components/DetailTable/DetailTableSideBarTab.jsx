﻿import React from "react";
import classnames from "classnames";
import styles from "./detailtable.module.css";

export default function DetailTableSideBarTab(props) {
  const { index, image, tabText, onDisplayTabClick } = props;
  return (
    <button
      onClick={() => onDisplayTabClick(index)}
      type="button"
      className={classnames(
        "list-group-item",
        "list-group-item-action",
        styles.sidebarText
      )}
    >
      <img src={image} alt="Default Grey Avatar" className="mr-3" />
      {tabText}
    </button>
  );
}
