import './App.css'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import toast, { Toaster } from 'react-hot-toast';
// import { useState } from 'react';
const router=createBrowserRouter(
  [
    {
      path:"/",
      element:
      <div>
        <Navbar/>
        <Home/>
      </div>
    },
    {
      path:"/AboutUs",
      element:
      <div>
        <Navbar/>
        <AboutUs/>
      </div>
    },
  ]
);

function App() {
  // const [count, setCount] = useState(0)

  return (
      <div>
          <RouterProvider router={router}/>
          <Toaster />
      </div>
  )
}

export default App
