import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveIncome } from '../redux/calculate';
import { NavLink, useNavigate } from 'react-router-dom';
// import './Quick.css'

const Quick = () => {
    const [eincome, setIncome] = useState('');
    const dispatch = useDispatch();
    const readincome = useSelector((state) => state.calculate.income);//to read from redux
    const navigate = useNavigate();
    useEffect(() => {
        const savedIncome = localStorage.getItem('income');

        if (savedIncome !== null) {
            dispatch(saveIncome(savedIncome));
        }
    }, [dispatch]);

    const popincome = () => {
        if (eincome === '') {
            alert('Please enter income');
            return;
        }

        const incomeNumber = Number(eincome);

        dispatch(saveIncome(incomeNumber));
        localStorage.setItem('income', incomeNumber);
        navigate("/QuickResult");
        // alert(`Income saved successfully: ₹${incomeNumber}`);
        
    };

    return (
        <div className="Quick-page">
            <div className="Quick-container">
                <h1 id='h1Qc'>Quick Tax Calculator</h1>
                <p className="subtitle1">Calculate your tax in seconds</p>

                <label className='label1'>Total Annual Income</label>
                <div className="input-wrapper1">
                    <span id='span1'>₹</span>
                    <input type="number" placeholder="Enter income" value={eincome} onChange={(e) => setIncome(e.target.value)} id='input1'/>
                </div>

                <label className='label1'>Age Group</label>
                <select>
                    <option value="">Select option</option>
                    <option value="60">Below 60 Years</option>
                    <option value="80">Between 60 - 80 Years</option>
                </select>

                <button className="calc-btn1" onClick={popincome}>Calculate Tax</button>
                
                <p className="footer-text1">
                    Quick estimation based on Indian tax slabs
                </p>
            </div>
        </div>
    )
}

export default Quick
