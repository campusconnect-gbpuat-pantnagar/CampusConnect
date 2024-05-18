import React, { useState } from "react";
import StyleSheet from "../signin/signin.module.css";
import FormInput from "../_components/form/form-input/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../_components/form/button/button";
import { useLocation, useNavigate } from "react-router-dom";
import StepTwoForm from "./step-two-form/step-two-form";
import StepOneForm from "./step-one-form/step-one-form";
const SignUpPage = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const StepOneSubmitHandler = (data) => {
    console.log(data);
    // TODO ✅ : Fetch the student data using student Id from gbpuat-email-checker service and validate
    navigate("/new/signup", { state: { studentId: data.studentId } });
  };

  const SteptwoSubmitHandler = (data) => {};
  console.log(state);
  // TODO ✅:  redirectToSignUp
  const redirectToSignIn = () => {
    navigate("/new/signin");
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
            <h3>Create your account</h3>
            <p>Welcome! Please fill in the details to get started.</p>
          </div>

          {state?.studentId ? (
            <StepTwoForm SteptwoSubmitHandler={SteptwoSubmitHandler} />
          ) : (
            <StepOneForm StepOneSubmitHandler={StepOneSubmitHandler} />
          )}

          <div className={StyleSheet.DontHaveAccount}>
            <p>Already have an account?</p>
            <span onClick={redirectToSignIn}>Sign In</span>
          </div>
        </div>
        <img src="/newlogin1.png" alt="fgfgdg" className={StyleSheet.image_2} />
      </div>
    </div>
  );
};

export default SignUpPage;
