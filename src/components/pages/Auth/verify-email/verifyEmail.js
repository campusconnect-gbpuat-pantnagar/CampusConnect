import React, { useContext, useEffect, useState } from "react";
import StyleSheet from "../signin/signin.module.css";
import VerifyStyles from "./verifyEmail.module.css";
import SubmitButton from "../_components/form/button/button.js";
import { useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import * as Yup from "yup";
import { Form, Formik } from "formik";

import FormOtpInput from "../_components/form/form-otp-input/form-otp-input.js";
import axios from "axios";
import { CAMPUSCONNECT_AUTH_BACKEND_API } from "../../../../utils/proxy.js";
import { NewAuthContext } from "../../../../context/newAuthContext/index.js";
const VerifyEmailPage = () => {
  const [formData, setFormData] = useState({
    otp: "",
    gbpuatEmail: "",
    isEmailVerified: true,
  });
  const { user, setUser, setTokens } = useContext(NewAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("One Time Password is required")
      .min(6, "Otp is invalid")
      .max(6, "Otp is invalid"),
  });

  const resendOtpHandler = () => {
    sendVerificationEmail();
  };
  async function verifyEmail(formData) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/verify-email`,
        formData
      );

      if (response.data.data) {
        const { user, tokens } = response.data.data;

        //  handling the  case when user  account is deleted
        if (user.isDeleted) {
          navigate("/account-recovery-consent", {
            state: {
              isDeleted: user.isDeleted,
              gbpuatEmail: user.gbpuatEmail,
              username: formData.username,
              password: formData.password,
            },
          });
          return;
        }

        if (user.isPermanentBlocked) {
          alert(
            `${response.data.message} You will be redirected to the admin contact page.`
          );
          // redirect to contact admin page
          return;
        }
        if (user.isTemporaryBlocked) {
          alert(`${response.data.message}`);
          return;
        }

        if (!user.isEmailVerified) {
          alert(`Email Sent successfully to your mail ${user.gbpuatEmail}`);
          navigate("/verify-email", {
            state: {
              gbpuatEmail: user.gbpuatEmail,
              gbpuatId: user.gbpuatId,
              isEmailVerified: user.isEmailVerified,
            },
          });
          return;
        }

        console.log(user, tokens);
        // save user to auth context and token to local storage
        setUser({
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName ? user?.lastName : "",
          username: user?.username,
          gbpuatId: user?.gbpuatId,
          gbpuatEmail: user?.gbpuatEmail,
          isEmailVerified: user?.isEmailVerified,
          isTemporaryBlocked: user?.isTemporaryBlocked,
          isPermanentBlocked: user?.isPermanentBlocked,
          isDeleted: user?.isDeleted,
          profilePicture: user?.profilePicture ? user?.profilePicture : "",
          bio: user?.bio ? user?.bio : "",
          showOnBoardingTour: user?.showOnBoardingTour,
          showOnBoarding: user.showOnBoarding,
          role: user?.role,
          lastActive: user?.lastActive,
          connectionLists:user?.connectionLists,
          academicDetails: {
            college: {
              name: user?.academicDetails?.college?.name,
              collegeId: user?.academicDetails?.college?.collegeId,
            },
            department: {
              name: user?.academicDetails?.department?.name,
              departmentId: user?.academicDetails?.department?.departmentId,
            },
            degreeProgram: {
              name: user?.academicDetails?.degreeProgram?.name,
              degreeProgramId:
                user?.academicDetails?.degreeProgram?.degreeProgramId,
            },
            batchYear: user?.academicDetails?.batchYear,
            designation: user?.academicDetails?.designation,
          },
        });
        setTokens({
          access_token: tokens?.access_token,
          access_token_expires_at: tokens?.access_token_expires_at,
        });
        setIsLoading(false);
        // save user to local storage
        navigate("/");
        // navigate to home page
      }

      setIsLoading(false);
    } catch (err) {
      alert(`Error: ${err.response.data.message}`);
      setIsLoading(false);
    }
  }
  const FormSubmitHandler = async (data) => {
    await verifyEmail({
      gbpuatEmail: formData.gbpuatEmail,
      otp: data.otp,
    });
  };

  async function sendVerificationEmail() {
    try {
      const response = await axios.post(
        `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/send-verification-email`,
        { gbpuatEmail: location.state.gbpuatEmail }
      );
      alert(`${response.data.message}`);
    } catch (err) {
      alert(`Error: ${err.response.data.message}`);
    }
  }
  useEffect(() => {
    console.log(location.state);
    if (!location.state) {
      console.log(`!location.state`);
      console.log(`!location.state`);
      navigate("/signin");
    }
    if (!location.state?.gbpuatEmail || location.state?.isEmailVerified) {
      console.log(`!location.state.gbpuatEmail`);
      navigate("/signin");
    }

    if (location.state && location.state?.gbpuatEmail) {
      console.log(location.state);
      setFormData({
        gbpuatEmail: location.state.gbpuatEmail,
        isEmailVerified: location.state.isEmailVerified,
        otp: "",
      });
    }
  }, [location]);

  const ContinueButtonIcon = isLoading ? (
    <span className={StyleSheet.spinner}></span>
  ) : (
    ""
  );
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
            <p>{formData.gbpuatEmail}</p>
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
                  maxLength="6"
                  pattern="\d*"
                  placeholder={"ex:456456"}
                />
                <div className={VerifyStyles.ResendOtp}>
                  <p>Didn't received the Otp?</p>
                  <span onClick={resendOtpHandler}>Resend Otp</span>
                </div>
                <SubmitButton
                  type={"submit"}
                  btnText={"Submit"}
                  Icon={ContinueButtonIcon}
                />
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
