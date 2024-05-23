import React, { useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../../_components/form/button/button";
import FormInput from "../../_components/form/form-input/FormInput";

import StyleSheet from "../../signin/signin.module.css";
const StepOneForm = ({
  StepOneSubmitHandler,
  customError,
  setCustomError,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    studentId: "",
  });
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    studentId: Yup.string()
      .required("student Id is required")
      .max(60)
      .matches(
        /^(\d+|.*@gbpuat.*\..+)$/,
        "Enter a valid student ID (e.g., 565XX or 565XX@gbpuat.ac.in)"
      ),
  });
  const location = useLocation();
  const ContinueButtonIcon = isLoading ? (
    <span className={StyleSheet.spinner}></span>
  ) : (
    <ArrowRight />
  );
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formData }}
      validationSchema={validationSchema}
      onSubmit={StepOneSubmitHandler}
      className={StyleSheet.Formik}
    >
      {(formik) => (
        <Form className={StyleSheet.FormikForm}>
          <FormInput
            setCustomError={setCustomError}
            customError={customError}
            label={"student Id"}
            name={"studentId"}
            placeholder={"565XX or 565XX@gbpuat.ac.in"}
          />

          <SubmitButton
            type={"submit"}
            btnText={"Continue"}
            Icon={ContinueButtonIcon}
          />
        </Form>
      )}
    </Formik>
  );
};

export default StepOneForm;
