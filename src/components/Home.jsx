import React from 'react'
import { NavLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const showDetailedCalcToast = () => {
  toast((t) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        fontSize: "15px",
        color: "#064e3b",        // dark green text
        padding: "12px 16px",
        border: "1px solid #16a34a",  // green border
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // subtle shadow
        backgroundColor: "#f0fdf4", // light green background
        minWidth: "300px",
      }}
    >
      <span>
        Detailed tax calculation is currently not available.{" "}
        <b style={{ color: "#16a34a" }}>
          Feature under development
        </b>
      </span>

      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          padding: "5px 14px",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#22c55e", // green button
          color: "#ffffff",
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  ));
};



const Home = () => {


  return (
    <div className='Homepage'>
      <div className='Homepage-card'>
        <div id='title'><h2>Income Tax Calculator </h2></div>
        <div>
          <p>
            ✓ Select Quick for instant results<br />
            ✓ Select Detailed for calculations that require more information
          </p>

        </div>
        <div className='btn-container'>
          <div><button ><NavLink to="/QuickCalculator">Quick Calcualtion</NavLink></button></div>
          {/* <div><button ><NavLink to="/DetailedCalculator">Detailed Calculation</NavLink></button></div> */}
          <div>
            <button><NavLink
              to="#"
              className={({ isActive }) =>
                isActive ? "" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                showDetailedCalcToast();
              }}
            >
              Detailed Calculation
            </NavLink></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
