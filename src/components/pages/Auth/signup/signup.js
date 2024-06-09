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
import SignUpStyles from "./signup.module.css";
import { useDebounceValue } from "usehooks-ts";
import axios from "axios";
import {
  CAMPUSCONNECT_AUTH_BACKEND_API,
  GBPUAT_DATA_API,
} from "../../../../utils/proxy";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequest from "../../../../helpers/public-client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../utils/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
const SignUpPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [customError, setCustomError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const StepOneSubmitHandler = async (data) => {
    console.log(data);
    try {
      setCustomError("");
      setIsLoading(true);
      const res = await axios.get(
        `${GBPUAT_DATA_API}/api/v1/gbpuat-users/${data?.studentId}`
      );

      if (res.status === 200 && res.data) {
        // console.log("Success", res.data);
        navigate("/signup", { state: { studentId: data.studentId } });
        setIsLoading(false);
      }
    } catch (err) {
      // alert("Invalid university Id.");
      setIsLoading(false);
      setCustomError("Invalid university Id.");
    }

    // if (!isUserExist) {
    // }
    // TODO ✅ : Fetch the student data using student Id from gbpuat-email-checker service and validate
  };

  async function fetchCollegeDetails(collegeId) {
    const res = await axios.get(
      `${GBPUAT_DATA_API}/api/v1/colleges/${collegeId}`
    );
    if (res.status === 200) {
      return res.data;
    }
  }
  async function fetchDepartmentsDetails(departmentId) {
    const res = await axios.get(
      `${GBPUAT_DATA_API}/api/v1/departments/${departmentId}`
    );
    if (res.status === 200) {
      return res.data;
    }
  }
  async function fetchDegreeProgramDetails(degreeProgramId) {
    const res = await axios.get(
      `${GBPUAT_DATA_API}/api/v1/degree-programs/${degreeProgramId}`
    );
    if (res.status === 200) {
      return res.data;
    }
  }
  const SteptwoSubmitHandler = async (data) => {
    if (!isUsernameAvailable) {
      return;
    }
    console.log(data);
    try {
      setIsLoading(true);
      const collegeDetails = await fetchCollegeDetails(data.collegeName);
      const departmentDetails = await fetchDepartmentsDetails(
        data.departmentName
      );
      const degreeProgramDetails = await fetchDegreeProgramDetails(
        data.degreeProgram
      );
      const userData = {
        gbpuatId: data.gbpuatId,
        gbpuatEmail: data.gbpuatEmail,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        academicDetails: {
          college: {
            name: collegeDetails.name,
            collegeId: collegeDetails.id,
          },
          department: {
            name: departmentDetails.name,
            departmentId: departmentDetails.id,
          },
          degreeProgram: {
            name: degreeProgramDetails.name,
            degreeProgramId: degreeProgramDetails.id,
          },
          batchYear: data.batchYear,
          designation: data.designation,
        },
      };
      console.log(userData);
      // const response = await axios.post(
      //   `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/signup`,
      //   userData
      // );
      const requestConfig = {
        url: ServiceConfig.signupEndpoint,
        data: userData,
        method: "POST",
        showActual: true,
      };

      const response = await HttpRequest(requestConfig);
      console.log(response);
      if (response.data.data) {
        const { user } = response.data.data;

        // if the new user created the we create firebase user
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          user.gbpuatEmail,
          userData.password
        );

        const userRef = doc(db, "users", user.id);

        await setDoc(userRef, {
          uid: firebaseUser.user.uid,
          name: `${user.firstName} ${user.lastName}`,
          email: firebaseUser.user.email,
          appUserId: user.id,
        });

        // creating a userChats collection
        const currentUserRef = doc(db, "userChats", user.id);
        const CurrentUserChatsDocSnap = await getDoc(currentUserRef);

        console.log(currentUserRef, "currentUserRef");

        if (!CurrentUserChatsDocSnap.exists()) {
          await setDoc(doc(db, "userChats", user.id), {});
        }

        // add the user in the firebase document
        navigate("/signup", { state: null });
        navigate("/verify-email", {
          state: {
            gbpuatEmail: user.gbpuatEmail,
            gbpuatId: user.gbpuatId,
            isEmailVerified: user.isEmailVerified,
          },
        });
        toast.success(
          `Email Sent successfully to your mail ${user.gbpuatEmail}`
        );
        setIsLoading(false);
      }

      setCustomError("");
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(`Error: ${err.response?.data.message}`);
      setIsLoading(false);
    }
  };
  // TODO ✅:  redirectToSignUp
  const redirectToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className={StyleSheet.login}>
      <div className={`${StyleSheet.wrapper} ${SignUpStyles.wrapper}`}>
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
            <StepTwoForm
              setIsUsernameAvailable={setIsUsernameAvailable}
              isLoading={isLoading}
              customError={customError}
              setCustomError={setCustomError}
              SteptwoSubmitHandler={SteptwoSubmitHandler}
            />
          ) : (
            <StepOneForm
              isLoading={isLoading}
              StepOneSubmitHandler={StepOneSubmitHandler}
              customError={customError}
              setCustomError={setCustomError}
            />
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
