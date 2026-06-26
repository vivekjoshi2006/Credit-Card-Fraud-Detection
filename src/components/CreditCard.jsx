import React from 'react';

const CreditCard = ({ data, bank, isShielded }) => {
  return (
    <div className={`card-container ${data.flipped ? 'is-flipped' : ''}`}>
      <div className="card-inner">
        {/* Front */}
        <div className="card-front" style={{ background: bank.color }}>
          <div className="card-header">
            <span className="bank-name">{bank.bank}</span>
            <span className="chip"></span>
          </div>
          <div className="card-number-display">
            {isShielded ? data.maskedNumber : data.number || "XXXX XXXX XXXX XXXX"}
          </div>
          <div className="card-footer">
            <div className="holder">
              <label>CARD HOLDER</label>
              <div>{data.name || "YOUR NAME"}</div>
            </div>
            <div className="type-logo">{bank.type.toUpperCase()}</div>
          </div>
        </div>
        {/* Back */}
        <div className="card-back">
          <div className="black-bar"></div>
          <div className="cvv-section">
            <label>CVV</label>
            <div className="cvv-box">{data.cvv}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;