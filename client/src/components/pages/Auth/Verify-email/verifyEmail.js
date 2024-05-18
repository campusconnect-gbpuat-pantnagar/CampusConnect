import React, { useState } from "react";
import StyleSheet from "../Login/login.module.css";
import VerifyStyles from "./verifyEmail.module.css";
import SubmitButton from "../_components/form/button/button";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import OtpInput from "react-otp-input";
const VerifyEmailPage = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const handleChange = (newValue) => {
    setOtp(newValue);
  };
  //  redirectToSignUp
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
            <h3>Veriy Your Email</h3>
            <p>to Continue to CampusConnect </p>
          </div>
          <div className={VerifyStyles.YourEmail}>
            <span>
              <AccountCircleIcon />
            </span>
            <p>56553@gbpuat.ac.in</p>
          </div>
          <div className={VerifyStyles.OtpContainer}>
            {/* Implement The Otp Input with button */}
            {/* <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              separator={<span>-</span>}
            /> */}
          </div>

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

export default VerifyEmailPage;
