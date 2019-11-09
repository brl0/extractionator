import React from "react";
import classnames from "classnames";
import styles from "./masterdetail.module.css";

export default function MasterDetailSideBarTab(props) {
  const { index, tabText, onDisplayTabClick } = props;

  function onDisplayTabClickChange(index) {
    onDisplayTabClick(index);
  }

  return (
    <button
      onClick={() => onDisplayTabClickChange(index)}
      type="button"
      className={classnames(
        "list-group-item",
        "list-group-item-action",
        styles.sidebarText,
        styles.sidebarButton,
      )}
    >
      {tabText}
    </button>
  );
}
