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

  // SEPARATE MESSAGES
  const [loginMsg, setLoginMsg] = useState("");
  const [signupMsg, setSignupMsg] = useState("");
  // EMAIL VERIFICATION STATES
  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  /* Utility: auto clear message */
  const clearMessage = (setter) => {
    setTimeout(() => setter(""), 3000);
  };

  /* ================= LOGIN ================= */
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

        // ✅ CLEAR INPUTS
        setLoginData({
          email: "",
          password: "",
        });
      } else {
        setLoginMsg(data.message || "Login failed ❌");
      }

      clearMessage(setLoginMsg);
    } catch (err) {
      setLoginMsg("Server error ❌");
      clearMessage(setLoginMsg);
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e) => {
    if (!emailVerified) {
  setSignupMsg("Please verify email first ❌");
  clearMessage(setSignupMsg);
  return;
}

    e.preventDefault();
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

        // ✅ CLEAR INPUTS
        setSignupData({
          username: "",
          email: "",
          password: "",
        });

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
  setVerifyMsg("");

  try {
    const res = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupData.email }),
    });

    const data = await res.json();

    if (data.success) {
      setOtpPopup(true);
    } else {
      setVerifyMsg(data.message || "OTP failed ❌");
    }
  } catch {
    setVerifyMsg("Server error ❌");
  }
};

const verifyOtp = async () => {
  try {
    const res = await fetch(`${API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupData.email,
        otp,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEmailVerified(true);
      setOtpPopup(false);
      setOtp("");
    } else {
      alert("Invalid OTP ❌");
    }
  } catch {
    alert("Server error ❌");
  }
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
                  onClick={() => setIsToggled(true)}
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
    onChange={(e) =>
      setSignupData({ ...signupData, email: e.target.value })
    }
  />

  <label htmlFor="signup-email">Email</label>

  <button
    type="button"
    className="verify-btn"
    onClick={sendOtp}
    disabled={!signupData.email}
  >
    {emailVerified ? "Verified ✅" : "Verify"}
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
                  onClick={() => setIsToggled(false)}
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

      <button onClick={verifyOtp}>Verify OTP</button>

      <p className="otp-close" onClick={() => setOtpPopup(false)}>
        Cancel
      </p>
    </div>
  </div>
)}

    </>
  );
};

export default LoginSignup;
