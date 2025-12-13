import React, { useState } from "react";
import "./styles/LoginSignup.css"; // Make sure this matches your CSS filename

const LoginSignup = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      {/* The 'toggled' class is conditionally added based on state */}
      <div className={`auth-wrapper ${isToggled ? "toggled" : ""}`}>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* Login Panel */}
        <div className="credentials-panel signin">
          <h2 className="slide-element">Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="field-wrapper slide-element">
              <input type="text" required />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" required />
              <label>Password</label>
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

        {/* Welcome Section (Login side) */}
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* Signup Panel */}
        <div className="credentials-panel signup">
          <h2 className="slide-element">Register</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="field-wrapper slide-element">
              <input type="text" required />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="email" required />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" required />
              <label>Password</label>
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

        {/* Welcome Section (Signup side) */}
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>

      <div className="footer">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://your-portfolio-link.com"
            target="_blank"
            rel="noreferrer"
          >
            Dharm Dayani
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginSignup;
