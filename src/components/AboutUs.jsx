import React from "react";
// import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-section">

      <h1 className="about-title">About Us</h1>

      <p className="about-description">
        Welcome to <strong>Tax Calculator</strong> — a simple, fast, and accurate
        platform built to help individuals calculate their taxes effortlessly.
        Our goal is to remove complexity and provide clear, instant financial
        insights for everyone.
      </p>

      <div className="about-features">

        <div className="about-card">
          <h2>⚡ Easy to Use</h2>
          <p>
            A clean and user-friendly interface that makes tax calculations simple,
            even for beginners.
          </p>
        </div>

        <div className="about-card">
          <h2>📊 Accurate Results</h2>
          <p>
            Uses updated tax rules to give accurate calculations every time.
          </p>
        </div>

        <div className="about-card">
          <h2>🔒 Secure</h2>
          <p>
            Your data stays on your device — nothing is stored or shared.
          </p>
        </div>

      </div>

      <p className="about-footer-text">
        Our mission is to make finance simple, clear, and accessible to everyone.
      </p>

    </div>
  );
};

export default AboutUs;
