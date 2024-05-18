import { Icon } from "@material-ui/core";
import React from "react";
import styles from "./button.module.css";
const SubmitButton = ({ type, btnText, Icon, ...props }) => {
  return (
    <button {...props} type={type} className={styles.button}>
      <span>{btnText}</span>
      {Icon && Icon}
    </button>
  );
};

export default SubmitButton;
