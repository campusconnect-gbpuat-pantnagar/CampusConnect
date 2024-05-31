import React, { useState } from "react";
import { useField } from "formik";

import styles from "./FormInput.module.css";
import { useLocation } from "react-router-dom";
const FormInput = ({
  name,
  label,
  SecondIcon,
  IconClickHandler,
  FirstIcon,
  FirstIconClassName,
  placeholder,
  customError,
  setCustomError,
  handleFieldChange,
  pathname,
  customInputStyle,
  ...props
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [field, meta, helpers] = useField({
    name: name,
  });
  const inputStyle = isInputFocused
    ? { boxShadow: "rgb(145, 167, 247) 0px 0px 0px 1px" }
    : {};
  const InputStyleWithSecondIcon = SecondIcon
    ? { paddingRight: "2.5rem" }
    : { paddingRight: "1rem" };
  const InputStyleWithFirstIcon = FirstIcon
    ? { paddingLeft: "2rem" }
    : { paddingLeft: "1rem" };
  const handleBlur = (event) => {
    setIsInputFocused(false);
    field.onBlur(event);
  };

  const handleInputChange = (e) => {
    field.onChange(e);
    if (field.name === "username" && pathname.includes("signup")) {
      handleFieldChange(e.target.value);
    }
    if (
      field.name === "studentId" ||
      (field.name === "username" && pathname.includes("signup"))
    ) {
      setCustomError("");
    }
  };
  const isError =
    meta.touched && meta.error ? true : customError ? false : true;

  return (
    <div className={styles.FormInputContainer}>
      <label htmlFor={label}>{label}</label>
      <div className={styles.FormInput}>
        {FirstIcon && (
          <div className={`${styles.inputIconFirst} ${FirstIconClassName}`}>
            {FirstIcon && FirstIcon}
          </div>
        )}

        <input
          id={label}
          onFocus={() => setIsInputFocused(true)}
          {...field}
          {...props}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={handleBlur}
          style={{
            ...inputStyle,
            ...InputStyleWithSecondIcon,
            ...InputStyleWithFirstIcon,
            ...customInputStyle,
          }}
        />
        {SecondIcon && (
          <div
            onClick={IconClickHandler}
            className={`${styles.inputIconSecond}`}
          >
            {SecondIcon && SecondIcon}
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <p style={{ color: "red" }}>{`* ${meta.error}`}</p>
      )}
      {!isError && field.name === "username" ? (
        <p
          style={
            field.name === "username" &&
            customError &&
            customError?.includes("not")
              ? { color: "red", fontWeight: 600, fontSize: ".9rem" }
              : { color: "#32CD32", fontWeight: 600, fontSize: ".9rem" }
          }
        >
          {customError ? `${customError}` : `* ${meta.error}`}
        </p>
      ) : (
        !isError && (
          <p style={{ color: "red", fontWeight: 600, fontSize: ".9rem" }}>
            {customError ? `${customError}` : `* ${meta.error}`}
          </p>
        )
      )}
    </div>
  );
};

export default FormInput;
