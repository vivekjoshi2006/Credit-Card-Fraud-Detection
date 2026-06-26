import React, { useState, useEffect } from 'react';
import { getBankDetails } from './data/bankDb';
import { validateLuhn, formatCardNumber, maskNumber } from './utils/cardLogic';
import { calculateRiskScore } from './utils/fraudEngine';
import CreditCard from './components/CreditCard';
import FraudDashboard from './components/FraudDashboard';
import './App.css';

function App() {
  const [card, setCard] = useState({ number: '', maskedNumber: '', name: '', expiry: '', cvv: '', flipped: false });
  const [bank, setBank] = useState(getBankDetails(''));
  const [wallet, setWallet] = useState([]);
  const [shield, setShield] = useState(false);

  // Behavioral tracking states
  const [behavior, setBehavior] = useState({ isPasted: false, attempts: 0 });
  const [fraudReport, setFraudReport] = useState({ score: 0, flags: [], status: 'Safe' });

  // Load wallet items on initialization
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('credit-card-wallet')) || [];
    setWallet(saved);
  }, []);

  // Automatically recalculate fraud risk score on user changes
  useEffect(() => {
    const report = calculateRiskScore(card, behavior);
    setFraudReport(report);
  }, [card, behavior]);

  // Derived state to check if a valid bank has been selected
  const isBankSelected = bank.bank !== 'Credit Card' && bank.bank !== 'Indian Bank';

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    const formatted = formatCardNumber(raw);
    setCard(prev => ({ ...prev, number: formatted, maskedNumber: maskNumber(formatted) }));
    setBank(getBankDetails(formatted));
  };

  const handleNameChange = (e) => {
    setCard(prev => ({ ...prev, name: e.target.value }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value;
    const isDeleting = value.length < card.expiry.length;
    let clean = value.replace(/\D/g, '');
    
    // 1. Month validation
    if (clean.length === 1) {
      if (clean > '1') {
        clean = '0' + clean; // e.g., typing '5' auto-prefixes to '05'
      }
    } else if (clean.length === 2) {
      let month = parseInt(clean, 10);
      if (month > 12) clean = '12'; // Cap month at 12
      if (month === 0) clean = '01'; // Floor month at 01 (never 00)
    }
    
    // 2. Year validation
    if (clean.length > 2) {
      let month = clean.slice(0, 2);
      let year = clean.slice(2, 4);
      
      let mNum = parseInt(month, 10);
      if (mNum > 12) month = '12';
      if (mNum === 0) month = '01';
      
      if (year.length === 2) {
        const currentYearShort = 26; // Current Year 2026
        const maxYearShort = 40;     // Cap future years at 2040
        let yNum = parseInt(year, 10);
        
        if (yNum < currentYearShort) {
          year = currentYearShort.toString(); // Prevent past expired years
        } else if (yNum > maxYearShort) {
          year = maxYearShort.toString();     // Block extreme future years
        }
      }
      value = `${month}/${year}`;
    } else if (clean.length === 2 && !isDeleting) {
      value = `${clean}/`;
    } else {
      value = clean;
    }
    
    setCard(prev => ({ ...prev, expiry: value }));
  };

  const handlePaste = () => {
    setBehavior(prev => ({ ...prev, isPasted: true }));
  };

  const saveToWallet = () => {
    const nextAttempts = behavior.attempts + 1;
    setBehavior(prev => ({ ...prev, attempts: nextAttempts }));

    if (!isBankSelected) {
      alert("Please select a specific bank from the dropdown first!");
      return;
    }

    if (!card.number || card.number.replace(/\s/g, '').length === 0) {
      alert("Please enter a Card Number!");
      return;
    }

    if (!card.name || card.name.trim() === "") {
      alert("Please enter the Card Holder Name!");
      return;
    }

    if (!card.expiry || card.expiry.length < 5) {
      alert("Please enter a valid Expiry Date (MM/YY)!");
      return;
    }

    if (!card.cvv || card.cvv.length < 3) {
      alert("Please enter a valid 3-digit CVV!");
      return;
    }

    if (fraudReport.status === 'Fraud') {
      alert("🚨 Transaction Denied: High risk telemetry detected.");
      return;
    }

    if (!validateLuhn(card.number)) {
      alert("Invalid Card Number! Checksum verification failed.");
      return;
    }

    const isDuplicate = wallet.some(item => item.number === card.number);
    if (isDuplicate) {
      alert("This card is already saved in your digital wallet!");
      return;
    }

    const newWallet = [...wallet, { ...card, bank: bank.bank, id: Date.now() }];
    setWallet(newWallet);
    localStorage.setItem('bharat_wallet', JSON.stringify(newWallet));
    alert("✅ Approved: Card verified and stored in local wallet.");
  };

  return (
    <div className="app-wrapper">
      <div className="glass-panel main-dashboard">
        
        {/* LEFT COLUMN: Fraud Dashboard & Saved Wallet */}
        <div className="dashboard-column left-side">
          <FraudDashboard report={fraudReport} card={card} behavior={behavior} bank={bank} />

          <div className="wallet-area">
            <h3>Your Digital Wallet</h3>
            {wallet.length === 0 ? (
              <p className="no-cards">No cards stored.</p>
            ) : (
              wallet.map(item => (
                <div key={item.id} className="wallet-item">
                  <span>{item.bank}</span>
                  <span>•••• {item.number.slice(-4)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Visual Card & Inputs */}
        <div className="dashboard-column right-side">
          <div className="header">
            <h2>Credit Card Fraud Detection</h2>
            <button className={`shield-btn ${shield ? 'on' : ''}`} onClick={() => setShield(!shield)}>
              {shield ? '🛡️ Shield On' : '🔓 Shield Off'}
            </button>
          </div>

          <CreditCard data={card} bank={bank} isShielded={shield} />

          <div className="input-group">
            <select onChange={(e) => handleNumberChange(e)}>
              <option value="">Quick Select Bank</option>
              <option value="4591">SBI (Visa)</option>
              <option value="4242">HDFC (Visa)</option>
              <option value="6071">RuPay</option>
            </select>

            <input 
              placeholder="Card Number" 
              value={card.number} 
              onChange={handleNumberChange} 
              onPaste={handlePaste}
              disabled={!isBankSelected} // Disabled until bank selected
            />
            <input 
              placeholder="Card Holder Name" 
              value={card.name} 
              onChange={handleNameChange} 
              disabled={!isBankSelected} // Disabled until bank selected
            />
            
            <div className="flex-row">
              <input 
                placeholder="MM/YY" 
                maxLength="5" 
                value={card.expiry} 
                onChange={handleExpiryChange} 
                disabled={!isBankSelected} // Disabled until bank selected
              />
              <input
                placeholder="CVV" 
                maxLength="3" 
                value={card.cvv}
                onFocus={() => setCard({...card, flipped: true})} 
                onBlur={() => setCard({...card, flipped: false})}
                onChange={(e) => setCard({...card, cvv: e.target.value})} 
                disabled={!isBankSelected} // Disabled until bank selected
              />
            </div>

            <button 
              className="main-btn" 
              onClick={saveToWallet}
              disabled={!isBankSelected} // Disabled until bank selected
            >
              Add Card to Wallet (₹)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;