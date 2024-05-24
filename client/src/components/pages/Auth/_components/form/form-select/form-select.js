import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import Select from "react-select";
import styles from "../form-input/FormInput.module.css";

const FormSelect = ({
  name,
  options,
  label,
  placeholder,
  setSelectOption,
  isLoading,
  isDisabled,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const { setFieldValue } = useFormikContext();

  const SelectOnChange = (selectedOption) => {
    setFieldValue(name, selectedOption.value);
    setSelectOption(selectedOption.value);
  };

  return (
    <div className={styles.FormInputContainer}>
      <label htmlFor={label}>{label}</label>
      <div className={styles.FormInput}>
        <Select
          required
          {...props}
          options={options}
          onChange={SelectOnChange}
          value={options.find((option) => option.value === field.value) || null}
          placeholder={placeholder}
          className={styles.CustomSelect}
          loadingMessage={"Fetching Colleges.."}
          isLoading={isLoading}
          isDisabled={isDisabled}
         
        />
      </div>
      {meta.touched && meta.error && <p>{`* ${meta.error}`}</p>}
    </div>
  );
};

export default FormSelect;
