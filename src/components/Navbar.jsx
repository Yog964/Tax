import React from 'react';
import { NavLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const showAccountToast = () => {
  toast((t) => (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "15px",
        color: "#333",
      }}
    >
      <span>
        Account section is not enabled yet.{" "}
        <b style={{ color: "#d97706" }}>Database under development</b>
      </span>

      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          padding: "4px 10px",
          fontSize: "15px",
          fontWeight: "600",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#ef4444",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Dismiss
      </button>
    </span>
  ));
};


const Navbar = () => {
  return (
    <div className='navbar-section'>
      <div className='navbar-logo'>
        <img src="src/assets/logo.jpg" alt="Image Loading..." />
      </div>
      <div className='navbar-btn'>
        <div><NavLink to="/">Home</NavLink></div>
        <div><NavLink to="/AboutUs">About Us</NavLink></div>


        <div>
          <NavLink
            to="#"
            className={({ isActive }) =>
              isActive ? "" : ""
            }
            onClick={(e) => {
              e.preventDefault();
              showAccountToast();
            }}
          >
            Account
          </NavLink>
        </div>

      </div>
    </div>
  );
}

export default Navbar
