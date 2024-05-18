import React, { useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import SubmitButton from "../../_components/form/button/button";
import FormInput from "../../_components/form/form-input/FormInput";
import StepTwoFormStyles from "./step-two-form.module.css";
import StyleSheet from "../../signin/signin.module.css";
const StepTwoForm = ({ SteptwoSubmitHandler }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    collegeName: "",
    departmentName: "",
    degreeProgram: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const [typePassword, setTypePassword] = useState("password");
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/@.*gbpuat.*\..+$/, "Email must be university email."),

    firstName: Yup.string()
      .required("First name is required")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),

    collegeName: Yup.string()
      .required("College name is required")
      .max(100, "College name cannot exceed 100 characters"),

    departmentName: Yup.string()
      .required("Department name is required")
      .max(100, "Department name cannot exceed 100 characters"),

    degreeProgram: Yup.string()
      .required("Degree program is required")
      .max(100, "Degree program cannot exceed 100 characters"),

    username: Yup.string()
      .required("Username is required")
      .max(60, "Username cannot exceed 60 characters"),

    password: Yup.string()
      .required("Password is required")
      .max(60, "Password cannot exceed 60 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character"
      ),
  });

  const Icon = typePassword === "password" ? <Visibility /> : <VisibilityOff />;

  const IconClickHandler = () => {
    setTypePassword(typePassword === "text" ? "password" : "text");
  };

  const previousHandler = () => {
    navigate("/new/signup", { state: null });
  };
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formData }}
      validationSchema={validationSchema}
      onSubmit={SteptwoSubmitHandler}
      className={StyleSheet.Formik}
    >
      {(formik) => (
        <Form className={StyleSheet.FormikForm}>
          <FormInput
            label={"Email"}
            name={"email"}
            placeholder={"565XX@gbpuat.ac.in"}
          />
          <div className={StepTwoFormStyles.NameContainer}>
            <FormInput
              label={"First Name"}
              name={"firstName"}
              placeholder={""}
            />
            <FormInput label={"Last Name"} name={"lastName"} placeholder={""} />
          </div>
          <FormInput label={"College"} name={"collegeName"} placeholder={""} />
          <div className={StepTwoFormStyles.NameContainer}>
            <FormInput
              label={"Department"}
              name={"departmentName"}
              placeholder={""}
            />
            <FormInput
              label={"Degree Program"}
              name={"degreeProgram"}
              placeholder={""}
            />
          </div>
          <FormInput label={"Username"} name={"username"} placeholder={""} />
          <FormInput
            label={"password"}
            Icon={Icon}
            type={typePassword}
            IconClickHandler={IconClickHandler}
            name={"password"}
          />
          <div className={StepTwoFormStyles.FormButtons}>
            <SubmitButton
              className={StepTwoFormStyles.PreviousButton}
              onClick={previousHandler}
              btnText={"Previous"}
              Icon={<ArrowLeft className={StepTwoFormStyles.PreviousIcon} />}
            />
            <SubmitButton
              type={"submit"}
              btnText={"Continue"}
              Icon={<ArrowRight />}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StepTwoForm;
