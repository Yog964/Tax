import React from 'react'

const Home = () => {
  return (
    <div className='Homepage'>
      <div className='Homepage-card'>
        <div id='title'><h2>Income Tax Calculator </h2></div>
        <div>
          <p>
            ✓ Quick calculation for instant results <br />
            ✓ Detailed calculation for accurate tax planning
          </p>
        </div>
        <div className='btn-container'>
          <div><button>Quick Calcualtion</button></div>
          <div><button>Detailed Calculation</button></div>
        </div>
      </div>
    </div>
  )
}

export default Home;
