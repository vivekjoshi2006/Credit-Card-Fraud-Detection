import React from 'react';

const RiskMeter = ({ score, status }) => {
  const getColor = () => {
    if (status === 'Fraud') return '#ff4d4d'; // Red
    if (status === 'Suspicious') return '#ffcc00'; // Yellow
    return '#00ff88'; // Green
  };

  return (
    <div className="risk-meter-container">
      <div className="meter-bar">
        <div 
          className="meter-fill" 
          style={{ width: `${score}%`, backgroundColor: getColor() }}
        ></div>
      </div>
      <div className="status-text" style={{ color: getColor() }}>
        STATUS: {status.toUpperCase()} ({score}/100)
      </div>
    </div>
  );
};

export default RiskMeter;