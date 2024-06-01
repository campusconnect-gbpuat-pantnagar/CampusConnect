import React, { useContext, useEffect, useState } from "react";
import StyleSheet from "../signin/signin.module.css";
import FormInput from "../_components/form/form-input/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import SubmitButton from "../_components/form/button/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./account-recovery-consent.module.css";
import { CAMPUSCONNECT_AUTH_BACKEND_API } from "../../../../utils/proxy";
import { NewAuthContext } from "../../../../context/newAuthContext";
const AccountRecoveryConsentPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isDeleted: false,
    gbpuatEmail: "",
  });
  const { user, setUser, setTokens } = useContext(NewAuthContext);
  const [typePassword, setTypePassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function keepAccount(formData) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/keep-account`,
        formData
      );

      if (response.data.data) {
        const { user, tokens } = response.data.data;
        console.log(user);

        //  handling the  case when user  account is deleted
        if (user.isDeleted) {
          navigate("/account-recovery-consent", {
            state: {
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
        // saves the tokens and user in local storage..
        navigate("/");
      }

      setIsLoading(false);
    } catch (err) {
      alert(`Error: ${err.response.data.message}`);
      setIsLoading(false);
    }
  }

  const handleKeepAccount = async () => {
    // console.log(formData);
    await keepAccount({
      username: formData.username,
      password: formData.password,
    });
  };
  // TODO ✅:  redirectToSignUp
  const redirectToSignUp = () => {
    console.log("Redirecting to sign in");
    setFormData({
      username: "",
      password: "",
      gbpuatEmail: "",
      isDeleted: "",
    });
    navigate("/account-recovery-consent", { state: null });
    navigate("/signin");
  };
  const ContinueButtonIcon = isLoading ? (
    <span className={StyleSheet.spinner}></span>
  ) : (
    ""
  );

  useEffect(() => {
    if (!location.state) {
      navigate("/signin");
    }
    if (!location.state?.gbpuatEmail || !location.state?.isDeleted) {
      navigate("/signin");
    }

    if (location.state && location.state?.gbpuatEmail) {
      console.log(location.state);
      setFormData({
        username: location.state.username,
        password: location.state.password,
        gbpuatEmail: location.state.gbpuatEmail,
        isDeleted: location.state.isDeleted,
      });
    }
  }, [location]);

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
          <div className={styles.contentContainer}>
            <h3>Want to keep using this account?</h3>
            <p>
              You requested to delete itsrobin28. if you want to keep it, you
              have until June 23, 2024 to let us know Otherwise, all your
              information will be deleted.
            </p>
          </div>
          <SubmitButton
            type={"submit"}
            Icon={ContinueButtonIcon}
            onClick={handleKeepAccount}
            btnText={"Keep Account"}
          />
          <SubmitButton
            className={styles.secondaryButton}
            onClick={redirectToSignUp}
            type={"submit"}
            btnText={"Back to sign in"}
          />
        </div>
        <img src="/newlogin1.png" alt="fgfgdg" className={StyleSheet.image_2} />
      </div>
    </div>
  );
};

export default AccountRecoveryConsentPage;
