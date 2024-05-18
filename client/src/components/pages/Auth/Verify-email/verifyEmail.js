import React, { useState } from "react";
import StyleSheet from "../signin/signin.module.css";
import VerifyStyles from "./verifyEmail.module.css";
import SubmitButton from "../_components/form/button/button.js";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import * as Yup from "yup";
import { Form, Formik } from "formik";

import FormOtpInput from "../_components/form/form-otp-input/form-otp-input.js";
const VerifyEmailPage = () => {
  const [formData, setFormData] = useState({
    otp: "",
    email: "56553@gbpuat.ac.in",
  });

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("One Time Password is required")
      .min(6, "Otp is invalid")
      .max(6, "Otp is invalid"),
    email: Yup.string().required("Email is required").max(60),
  });

  const FormSubmitHandler = (data) => {
    console.log(data);
    alert(`otp: ${data.otp}, email: ${data.email}`);
  };

  const resendOtpHandler = () => {};
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
            <h3>Veriy Your Email</h3>
            <p>to Continue to CampusConnect </p>
            <p style={{ textAlign: "center", fontWeight: 500 }}>
              We will send you a One Time Password on your Email.
            </p>
          </div>
          <div className={VerifyStyles.YourEmail}>
            <span>
              <AccountCircleIcon />
            </span>
            <p>{formData.email}</p>
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
                <FormOtpInput
                  label={"One Time Password"}
                  name={"otp"}
                  type="otp"
                  maxlength="6"
                  pattern="\d*"
                  placeholder={"ex:456456"}
                />
                <div className={VerifyStyles.ResendOtp}>
                  <p>Didn't received the Otp?</p>
                  <span onClick={resendOtpHandler}>Resend Otp</span>
                </div>
                <SubmitButton type={"submit"} btnText={"Submit"} />
              </Form>
            )}
          </Formik>

          {/* <div className={StyleSheet.DontHaveAccount}>
            <p>Don't have an account?</p>
            <span onClick={redirectToSignUp}>Sign up</span>
          </div> */}
        </div>
        <img src="/newlogin1.png" alt="fgfgdg" className={StyleSheet.image_2} />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
