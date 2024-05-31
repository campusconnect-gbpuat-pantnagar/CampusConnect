import React, { useState } from "react";
import { useField } from "formik";

import styles from "./FormInput.module.css";
const FormOtpInput = ({
  name,
  label,
  Icon,
  IconClickHandler,
  placeholder,
  type,
  ...props
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [field, meta, helpers] = useField({
    name: name,
  });
  const inputStyle = isInputFocused
    ? { boxShadow: "rgb(145, 167, 247) 0px 0px 0px 1px" }
    : {};
  const handleBlur = (event) => {
    setIsInputFocused(false);
    field.onBlur(event);
  };
  const handleInputChange = (e) => {
    if (type === "otp" && !/^\d*$/.test(e.target.value)) {
      e.preventDefault();
    } else {
      field.onChange(e);
    }
  };
  return (
    <div className={styles.FormInputContainer}>
      <label htmlFor={label}>{label}</label>
      <div className={styles.FormInput}>
        <input
          id={label}
          onFocus={() => setIsInputFocused(true)}
          {...field}
          {...props}
          onChange={handleInputChange}
          onBlur={handleBlur}
          style={inputStyle}
          maxLength={type === "otp" ? "6" : props.maxLength}
          pattern={type === "otp" ? "\\d*" : props.pattern}
        />
        <div onClick={IconClickHandler} className={styles.inputIconSecond}>
          {Icon && Icon}
        </div>
      </div>
      {meta.touched && meta.error && <p>{`* ${meta.error}`}</p>}
    </div>
  );
};

export default FormOtpInput;
