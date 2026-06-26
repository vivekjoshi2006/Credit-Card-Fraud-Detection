import { validateLuhn } from './cardLogic';

export const calculateRiskScore = (cardData, behavior) => {
  let score = 0;
  let flags = [];

  const cleanNum = cardData.number.replace(/\D/g, '');

  // 1. If the input is empty, return a safe default score of 0 immediately
  if (cleanNum.length === 0) {
    return { score: 0, flags: [], status: 'Safe' };
  }

  // 2. Check Luhn Validity
  if (cleanNum.length >= 15) {
    const isLuhnValid = validateLuhn(cardData.number);
    if (!isLuhnValid) {
      score += 80;
      flags.push("Failed mathematical checksum");
    }
  }

  // 3. Copy-Paste Detection
  if (behavior.isPasted) {
    score += 20;
    flags.push("Data entered via copy-paste");
  }

  // 4. BIN Analysis
  const bin = cardData.number.replace(/\s/g, '').substring(0, 6);
  if (["411111", "424242"].includes(bin)) { 
    score += 30;
    flags.push("Common test card number detected");
  }

  // 5. Virtual Check
  if (cardData.type === 'prepaid') {
    score += 15;
    flags.push("Disposable/Prepaid card type");
  }

  // 6. Name Check
  const suspiciousNames = ['test', 'admin', 'unknown', 'user'];
  if (cardData.name && suspiciousNames.includes(cardData.name.toLowerCase().trim())) {
    score += 40;
    flags.push("Suspicious Cardholder Name");
  }

  return { 
    score: Math.min(score, 100), 
    flags,
    status: score > 70 ? 'Fraud' : score > 30 ? 'Suspicious' : 'Safe'
  };
};