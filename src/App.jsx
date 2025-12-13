import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import toast, { Toaster } from 'react-hot-toast';
import Quick from './components/Quick';
import Detailed from './components/Detailed';
import QuickResult from './components/QuickResult';
import DetailedResult from './components/DetailedResult';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/QuickCalculator" element={<Quick />} />
        <Route path="/DetailedCalculator" element={<Detailed />} />
        <Route path="/QuickResult" element={<QuickResult />} />
        <Route path="/DetailedResult" element={<DetailedResult />} />
        
      </Routes>
      <Toaster />
    </HashRouter>
  )
}

export default App
