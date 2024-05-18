import React from "react";
import StyleSheet from "./login.module.css";
const LoginPage = () => {
  return (
    <div className={StyleSheet.login}>
      <div className={StyleSheet.wrapper}>
        <img
          src="/newlogin.png"
          className={StyleSheet.image_1}
          alt="newlogin"
        />
        <form className={StyleSheet.form} action="">
          <div className={StyleSheet.logo}>
            <img src="/cc_logo_mobile.png" alt="campusconnect_logo" />
          </div>
          <div className={StyleSheet.signinInfo}>
            <h3>Sign in to Campus Connect</h3>
            <p>Welcome back! Please sign in to continue</p>
          </div>
          {/* TODO✅ : implements
           * 1. render the Logo of campus Connect
             2. Sign In to Campus Connect
             3. Welcome Back! please sign in to continue
           *
           * */}
        </form>
        <img src="/newlogin1.png" alt="fgfgdg" className={StyleSheet.image_2} />
      </div>
    </div>
  );
};

export default LoginPage;
