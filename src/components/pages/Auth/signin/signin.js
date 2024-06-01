import React, { useContext, useState } from "react";
import StyleSheet from "./signin.module.css";
import FormInput from "../_components/form/form-input/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../_components/form/button/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CAMPUSCONNECT_AUTH_BACKEND_API } from "../../../../utils/proxy";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { useLocalStorage } from "usehooks-ts";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequest from "../../../../helpers/public-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../utils/config/firebase";
const SignInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [value, setValue, removeValue] = useLocalStorage("_currentuser", {});
  const { user, setUser, setTokens } = useContext(NewAuthContext);
  const [typePassword, setTypePassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain alphanumeric characters and underscores"
      )
      .required("Username is required")
      .max(60, "Username cannot exceed 60 characters"),

    password: Yup.string()
      .required("Password is required")
      .max(60, "Password cannot exceed 60 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/,
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character {@$#!%*?&}"
      ),
  });

  const Icon = typePassword === "password" ? <Visibility /> : <VisibilityOff />;

  const IconClickHandler = () => {
    setTypePassword(typePassword === "text" ? "password" : "text");
  };

  async function signin(formData) {
    try {
      setIsLoading(true);
      const requestConfig = {
        url: ServiceConfig.signinEndPoint,
        data: formData,
        method: "POST",
        showActual: true,
      };

      const response = await HttpRequest(requestConfig);
      // const response = await axios.post(
      //   `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/signin`,
      //   formData
      // );
      console.log(response);

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
        // Implementation of signin with firebase using user email and password
        await signInWithEmailAndPassword(
          auth,
          user.gbpuatEmail,
          formData.password
        );
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
        // navigate to home page
        navigate("/");
      }

      setIsLoading(false);
    } catch (err) {
      alert(`Error: ${err.response.data.message}`);
      setIsLoading(false);
    }
  }

  // ✅ TODO: send the signin request to the backend server
  const FormSubmitHandler = async (data) => {
    await signin({
      username: data.username,
      password: data.password,
    });
  };

  // TODO ✅:  redirectToSignUp
  const redirectToSignUp = () => {
    navigate("/signup");
  };
  const ContinueButtonIcon = isLoading ? (
    <span className={StyleSheet.spinner}></span>
  ) : (
    <ArrowRight />
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
                <FormInput
                  pathname="signin"
                  label={"username"}
                  name={"username"}
                  FirstIconClassName={StyleSheet.usernameIcon}
                  FirstIcon={<span>@</span>}
                />
                <FormInput
                  label={"password"}
                  SecondIcon={Icon}
                  type={typePassword}
                  IconClickHandler={IconClickHandler}
                  name={"password"}
                />
                <SubmitButton
                  type={"submit"}
                  btnText={"Continue"}
                  Icon={ContinueButtonIcon}
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
