import React, { useState } from "react";
import { useField } from "formik";

import styles from "./FormInput.module.css";
const FormInput = ({
  name,
  label,
  Icon,
  IconClickHandler,
  placeholder,
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

  return (
    <div className={styles.FormInputContainer}>
      <label htmlFor={label}>{label}</label>
      <div className={styles.FormInput}>
        <input
          id={label}
          onFocus={() => setIsInputFocused(true)}
          {...field}
          {...props}
          onBlur={handleBlur}
          style={inputStyle}
        />
        <div onClick={IconClickHandler} className={styles.inputIconSecond}>
          {Icon && Icon}
        </div>
      </div>
      {meta.touched && meta.error && <p>{`* ${meta.error}`}</p>}
    </div>
  );
};

export default FormInput;
