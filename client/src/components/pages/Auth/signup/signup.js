import React, { useState } from "react";
import StyleSheet from "../signin/signin.module.css";
import FormInput from "../_components/form/form-input/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../_components/form/button/button";
import { useNavigate } from "react-router-dom";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    studentId: "",
  });
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    studentId: Yup.string().required("student Id is required").max(60),
  });

  const stepOneSubmitHandler = (data) => {
    console.log(data);
    // TODO ✅ : Fetch the student data using student Id from gbpuat-email-checker service and validate

    alert(`studentId: ${data.studentId}, `);
  };

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
          <Formik
            enableReinitialize
            initialValues={{ ...formData }}
            validationSchema={validationSchema}
            onSubmit={stepOneSubmitHandler}
            className={StyleSheet.Formik}
          >
            {(formik) => (
              <Form className={StyleSheet.FormikForm}>
                <FormInput
                  label={"student Id"}
                  name={"studentId"}
                  placeholder={"565XX or 565XX@gbpuat.ac.in"}
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
