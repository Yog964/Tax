import React from 'react'
// import './Quick.css'

const Quick = () => {
  return (
    <div className="Quick-page">
      <div className="Quick-container">
        <h1>Quick Tax Calculator</h1>
        <p className="subtitle">Calculate your tax in seconds</p>

        <label>Total Annual Income</label>
        <div className="input-wrapper">
          <span>₹</span>
          <input type="number" placeholder="Enter income" />
        </div>

        <label>Age Group</label>
        <select>
          <option value="">Select option</option>
          <option value="60">Below 60 Years</option>
          <option value="80">Between 60 - 80 Years</option>
        </select>

        <button className="calc-btn">Calculate Tax</button>

        <p className="footer-text">
          Quick estimation based on Indian tax slabs
        </p>
      </div>
    </div>
  )
}

export default Quick
