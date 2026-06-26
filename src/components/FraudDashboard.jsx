import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Globe, Activity } from 'lucide-react';

const FraudDashboard = ({ report, card, behavior, bank }) => {
  const { score, flags, status } = report;

  const getStatusDetails = () => {
    if (status === 'Fraud') {
      return {
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.12)',
        text: 'High Risk - Decline Transaction',
        icon: <ShieldAlert size={20} color="#ef4444" />
      };
    } else if (status === 'Suspicious') {
      return {
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        text: 'Medium Risk - Push 3D-Secure OTP',
        icon: <AlertTriangle size={20} color="#f59e0b" />
      };
    }
    return {
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      text: 'Low Risk - Approved',
      icon: <ShieldCheck size={20} color="#10b981" />
    };
  };

  const details = getStatusDetails();

  return (
    <div className="fraud-dashboard">
      {/* Risk Alert Panel */}
      <div className="dashboard-status-panel" style={{ backgroundColor: details.bgColor, borderColor: details.color, borderWidth: '1px', borderStyle: 'solid' }}>
        <div className="status-flex">
          {details.icon}
          <span className="status-message" style={{ color: details.color }}>
            {details.text}
          </span>
        </div>
        <div className="score-pill" style={{ backgroundColor: details.color }}>
          Risk Score: {score}/100
        </div>
      </div>

      <div className="metrics-grid">
        {/* Geo-IP Checker */}
        <div className="metric-box">
          <div className="metric-title">
            <Globe size={16} />
            <span>Geo IP Matching</span>
          </div>
          <div className="metric-content">
            <p>Simulated IP: <span className="highlight">Mumbai, India</span></p>
            <p>Issuer Location: <span className="highlight">{bank.country || 'India'}</span></p>
            {bank.country && bank.country !== 'India' && (
              <span className="warning-label">⚠️ International Card not allowed</span>
            )}
          </div>
        </div>

        {/* Behavioral Metrics */}
        <div className="metric-box">
          <div className="metric-title">
            <Activity size={16} />
            <span>Behavioral Pattern</span>
          </div>
          <div className="metric-content">
            <p>Entry Method: <span className="highlight">{behavior.isPasted ? 'Pasted (Suspicious)' : 'Keyboard'}</span></p>
            <p>Submissions: <span className="highlight">{behavior.attempts} / 3</span></p>
            {behavior.attempts >= 3 && (
              <span className="warning-label">⚠️ High submission count</span>
            )}
          </div>
        </div>
      </div>

      {/* Flag Signals List */}
      <div className="flag-section">
        <h4>Flagged Risks</h4>
        {flags.length > 0 ? (
          <ul className="flag-list">
            {flags.map((flag, index) => (
              <li key={index} className="flag-item">
                <AlertTriangle size={14} color="#f59e0b" style={{ marginRight: '8px' }} />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-flags">
            <ShieldCheck size={16} color="#10b981" style={{ marginRight: '8px' }} />
            <span>All checks passed.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudDashboard;