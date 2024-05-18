import { Icon } from "@material-ui/core";
import React from "react";
import styles from "./button.module.css";
const SubmitButton = ({ className, type, btnText, Icon, ...props }) => {
  return (
    <button {...props} type={type} className={`${styles.button} ${className}`}>
      <span>{btnText}</span>
      {Icon && Icon}
    </button>
  );
};

export default SubmitButton;
