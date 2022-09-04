import React, { useEffect, useState, useTransition } from "react";
import "../css/login.css";
import Points from "../components/Points";
import { useNavigate } from "react-router-dom";

import {
  authentication,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  logout,
} from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../components/Loader";

function Login() {
  const Navigate = useNavigate();
  const [user, loading, error] = useAuthState(authentication);
  const countryCode = "+91";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expandForm, setExpandForm] = useState(false);
  const [err, setError] = useState();
  const [otp, setOTP] = useState();
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      authentication
    );
  };
  const requestOTP = () => {
    const phone = "+91" + phoneNumber;
    if (phone.length >= 12) {
      setExpandForm(true);
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, phone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const verifyOTP = () => {
    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          const user = result.user;
        })
        .catch((error) => {
          setError(error);
        });
    }
  };
  useEffect(() => {
    if (user) {
      Navigate("/");
    }
  }, [user]);
  if (loading || user) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }
  return (
    <div
      style={{ display: "flex", background: "#eee", justifyContent: "center" }}
    >
      <div className="login-container">
        <div className="left">
          <div className="list">
            <Points
              title={"Create Customizable Blogs"}
              subtitle={
                "Create blogs with different fonts, images, and embed links"
              }
            />
            <Points
              title={"Connect with people"}
              subtitle={
                "Connect to different people from different walks of life"
              }
            />
            <Points
              title={"Explore"}
              subtitle={"Search for blogs and users and read their work"}
            />
          </div>
          <div className="ico"></div>
        </div>
        <div className="right">
          <div className="form">
            <div className="head">Login to Continue</div>
            <div className="body">
              <div className="field">
                <label>Enter Mobile Number</label>
                <div className="input-container">
                  <div className="code">{countryCode}</div>
                  <input onChange={(e) => setPhoneNumber(e.target.value)} />
                  <button onClick={() => requestOTP()} className="send-btn">
                    SEND OTP
                  </button>
                </div>
                {expandForm ? (
                  <div className="field mt-20">
                    <label style={{ color: "#51AD4D", fontSize: 15 }}>
                      OTP sent to {phoneNumber}
                    </label>
                    <div className="input-container">
                      <input
                        className="br-3"
                        placeholder="Enter OTP"
                        onChange={(e) => setOTP(e.target.value)}
                      />
                      <div style={{ width: 150, fontSize: 14 }}>Resend OTP</div>
                    </div>
                    <button className="verify" onClick={() => verifyOTP()}>
                      VERIFY
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Login;
