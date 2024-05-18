import React, { useState } from "react";
import StyleSheet from "./signin.module.css";
import FormInput from "../_components/form/form-input/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../_components/form/button/button";
import { useNavigate } from "react-router-dom";
const SignInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [typePassword, setTypePassword] = useState("password");
  const navigate = useNavigate();
  const validationSchema = Yup.object({
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

  // ✅ TODO: send the signin request to the backend server
  const FormSubmitHandler = (data) => {
    console.log(data);
    alert(`username: ${data.username}, password: ${data.password}`);
  };

  // TODO ✅:  redirectToSignUp
  const redirectToSignUp = () => {
    navigate("/new/signup");
  };

  return (
    <div className={StyleSheet.login}>
      <div className={StyleSheet.wrapper}>
        <img
          src="/newlogin.png"
          className={StyleSheet.image_1}
          alt="newlogin"
        />
        <div className={StyleSheet.formContainer} action="">
          <div className={StyleSheet.logo}>
            <img src="/cc_logo_mobile.png" alt="campusconnect_logo" />
          </div>
          <div className={StyleSheet.signinInfo}>
            <h3>Sign in to CampusConnect</h3>
            <p>Welcome back! Please sign in to continue</p>
          </div>
          <Formik
            enableReinitialize
            initialValues={{ ...formData }}
            validationSchema={validationSchema}
            onSubmit={FormSubmitHandler}
            className={StyleSheet.Formik}
          >
            {(formik) => (
              <Form className={StyleSheet.FormikForm}>
                <FormInput label={"username"} name={"username"} />
                <FormInput
                  label={"password"}
                  Icon={Icon}
                  type={typePassword}
                  IconClickHandler={IconClickHandler}
                  name={"password"}
                />
                <SubmitButton
                  type={"submit"}
                  btnText={"Continue"}
                  Icon={<ArrowRight />}
                />
              </Form>
            )}
          </Formik>
          <div className={StyleSheet.DontHaveAccount}>
            <p>Don't have an account?</p>
            <span onClick={redirectToSignUp}>Sign up</span>
          </div>
        </div>
        <img src="/newlogin1.png" alt="fgfgdg" className={StyleSheet.image_2} />
      </div>
    </div>
  );
};

export default SignInPage;
