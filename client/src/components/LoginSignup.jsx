import React, { useState } from "react";
import "../styles/LoginSignup.css";

const API_URL = "http://localhost:5000/api/auth";

const LoginSignup = () => {
  const [isToggled, setIsToggled] = useState(false);

  // LOGIN STATE
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // SIGNUP STATE
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginMsg, setLoginMsg] = useState("");
  const [signupMsg, setSignupMsg] = useState("");
  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [forgotPopup, setForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetStage, setResetStage] = useState(1);
  const [newPassword, setNewPassword] = useState("");

  const clearMessage = (setter) => {
    setTimeout(() => setter(""), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setLoginMsg("Login successful ✅");
        setLoginData({ email: "", password: "" });
      } else {
        setLoginMsg(data.message || "Login failed ❌");
      }
      clearMessage(setLoginMsg);
    } catch (err) {
      setLoginMsg("Server error ❌");
      clearMessage(setLoginMsg);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setSignupMsg("Please verify email first ❌");
      clearMessage(setSignupMsg);
      return;
    }
    setSignupMsg("");

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (data.userId) {
        setSignupMsg("Registration successful ✅ Please login");
        setSignupData({ username: "", email: "", password: "" });
        setEmailVerified(false);
        setOtp("");
        setOtpPopup(false);
        setVerifyMsg("");
        setIsToggled(false);
      } else {
        setSignupMsg(data.message || "Signup failed ❌");
      }

      clearMessage(setSignupMsg);
    } catch (err) {
      setSignupMsg("Server error ❌");
      clearMessage(setSignupMsg);
    }
  };

  const sendOtp = async () => {
    if (otpTimer > 0) return;

    if (!signupData.email) {
      setVerifyMsg("Enter email first ❌");
      clearMessage(setVerifyMsg);
      return;
    }

    setOtpLoading(true);
    setVerifyMsg("");

    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpPopup(true);
        setOtpTimer(30);

        const interval = setInterval(() => {
          setOtpTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setVerifyMsg(data.message || "OTP failed ❌");
      }
    } catch {
      setVerifyMsg("Server error ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;

    setVerifyLoading(true);

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email.trim(), otp }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailVerified(true);
        setOtpPopup(false);
        setOtp("");
        setVerifyMsg("Email verified ✅");
        clearMessage(setVerifyMsg);
      } else {
        setVerifyMsg(data.message || "Invalid OTP ❌");
      }
    } catch {
      setVerifyMsg("Server error ❌");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Forgot Password functions (same as before)
  const sendForgotOtp = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/forgot-password/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail.trim() }),
    });
    const data = await res.json();
    if (data.success) setResetStage(2);
    else alert(data.message || "Failed ❌");
  };

  const verifyForgotOtp = async () => {
    const res = await fetch(`${API_URL}/forgot-password/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp }),
    });
    const data = await res.json();
    if (data.success) setResetStage(3);
    else alert("Invalid OTP ❌");
  };

  const resetPassword = async () => {
    const res = await fetch(`${API_URL}/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail.trim(), password: newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Password changed ✅");
      setForgotPopup(false);
      setResetStage(1);
    }
  };

  const goToSignup = () => {
    setIsToggled(true);
    setSignupData({ username: "", email: "", password: "" });
    setEmailVerified(false);
    setOtp("");
    setOtpPopup(false);
    setVerifyMsg("");
    setSignupMsg("");
  };

  const goToLogin = () => {
    setIsToggled(false);
    setLoginData({ email: "", password: "" });
    setLoginMsg("");
    setEmailVerified(false);
    setOtp("");
    setOtpPopup(false);
    setVerifyMsg("");
  };
  return (
    <>
      <div className={`auth-wrapper ${isToggled ? "toggled" : ""}`}>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* ================= LOGIN PANEL ================= */}
        <div className="credentials-panel signin">
          <h2 className="slide-element">Login</h2>

          {loginMsg && (
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                color: "#00d4ff",
                fontSize: "14px",
              }}
            >
              {loginMsg}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <div className="field-wrapper slide-element">
              <input
                type="email"
                id="login-email"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />

              <label htmlFor="login-email">Email</label>

              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                id="login-password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />

              <label htmlFor="login-password">Password</label>

              <i className="fa-solid fa-lock"></i>
            </div>
            <p
              style={{ fontSize: "12px", cursor: "pointer", color: "#00d4ff" }}
              onClick={() => setForgotPopup(true)}
            >
              Forgot Password?
            </p>
            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit">
                Login
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Don't have an account? <br />
                <button
                  type="button"
                  className="register-trigger sign-btn"
                  onClick={goToSignup}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section (Login) */}
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* ================= SIGNUP PANEL ================= */}
        <div className="credentials-panel signup">
          <h2 className="slide-element">Register</h2>

          {signupMsg && (
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                color: "#00d4ff",
                fontSize: "14px",
              }}
            >
              {signupMsg}
            </p>
          )}

          <form onSubmit={handleSignup}>
            <div className="field-wrapper slide-element">
              <input
                type="text"
                id="signup-username"
                required
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
              />

              <label htmlFor="signup-username">Username</label>

              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element verify-wrapper">
              <input
                type="email"
                id="signup-email"
                required
                value={signupData.email}
                onChange={(e) => {
                  setSignupData({ ...signupData, email: e.target.value });

                  // 🔥 reset verification when email changes
                  setEmailVerified(false);
                  setVerifyMsg("");
                  setOtp("");
                }}
              />

              <label htmlFor="signup-email">Email</label>

              <button
                type="button"
                className="verify-btn"
                onClick={sendOtp}
                disabled={
                  !signupData.email ||
                  emailVerified ||
                  otpTimer > 0 ||
                  otpLoading
                }
              >
                {emailVerified
                  ? "Verified ✅"
                  : otpLoading
                  ? "Sending..."
                  : otpTimer > 0
                  ? `Resend in ${otpTimer}s`
                  : "Verify"}
              </button>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                id="signup-password"
                required
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />

              <label htmlFor="signup-password">Password</label>

              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit">
                Register
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Already have an account? <br />
                <button
                  type="button"
                  className="login-trigger sign-btn"
                  onClick={goToLogin}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section (Signup) */}
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>

      <div className="footer">
        <p>
          Made with ❤️ by{" "}
          <a href="/" target="_blank" rel="noreferrer">
            Dharm Dayani
          </a>
        </p>
      </div>
      {otpPopup && (
        <div className="otp-overlay">
          <div className="otp-box">
            <h3>Email Verification</h3>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={verifyLoading}>
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="otp-close" onClick={() => setOtpPopup(false)}>
              Cancel
            </p>
          </div>
        </div>
      )}
      {forgotPopup && (
  <div className="otp-overlay">
    <div className="otp-box">
      <h3>Reset Password</h3>

      {resetStage === 1 && (
        <>
          <input
            placeholder="Enter Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button type="button" onClick={sendForgotOtp}>
  Send OTP
</button>

        </>
      )}

      {resetStage === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={forgotOtp}
            onChange={(e) => setForgotOtp(e.target.value)}
          />
          <button type="button" onClick={verifyForgotOtp}>Verify OTP</button>
        </>
      )}

      {resetStage === 3 && (
        <>
          <input  
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" onClick={resetPassword}>Reset Password</button>
        </>
      )}

      <p className="otp-close" onClick={() => setForgotPopup(false)}>
        Cancel
      </p>
    </div>
  </div>
)}
    </>
  );
};

export default LoginSignup;
